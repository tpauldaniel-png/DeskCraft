# DeskCraft — Day 66 catalogue load-test baseline

Test date: 3 November 2026  
Deliverable: Initial performance report  
Environment: Local Windows development machine; API at `http://127.0.0.1:8000`.

## Findings

All four recorded baseline runs completed with zero failed requests. With caching enabled, the 50-user run recorded **24.70 requests/second**, **15 ms p95**, and **20 ms p99** across 5,021 requests.

At 25 users, aggregate p95 was **15 ms with caching** versus **23 ms with caching bypassed**: an observed reduction of 8 ms, or approximately 35%. Average latency was 9.74 ms versus 14.37 ms. This comparison is one run per configuration; repeated runs are needed to establish variability.

These results describe the tested local catalogue workload. They do not establish maximum capacity, production performance, or a production service-level objective.

## Aggregate results

All latency values are in milliseconds. Values are transcribed from Locust's aggregate statistics, with averages and throughput rounded to two decimal places. Percentiles use Locust's reported response-time buckets.

| Cache mode | Simulated users | Recorded duration | Requests | Average ms | p50 ms | p95 ms | p99 ms | Requests/s | Failures | Error rate |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Enabled | 10 | 3 minutes and 24 seconds | 1,011 | 9.51 | 9 | 14 | 22 | 4.94 | 0 | 0% |
| Enabled | 25 | 3 minutes and 24 seconds | 2,538 | 9.74 | 9 | 15 | 20 | 12.40 | 0 | 0% |
| Enabled | 50 | 3 minutes and 23 seconds | 5,021 | 9.95 | 10 | 15 | 20 | 24.70 | 0 | 0% |
| Bypassed | 25 | 3 minutes and 25 seconds | 2,564 | 14.37 | 13 | 23 | 34 | 12.45 | 0 | 0% |

The six primary measurements are p50, p95, p99, requests/second, simulated concurrent users, and error rate. A p95 of 15 ms means approximately 95% of recorded requests completed within that reported latency bucket. Simulated users include users waiting between tasks; they are not all sending requests at the same instant.

## Cache comparison by endpoint — 25 users

| Request group | Cached requests | Bypassed requests | Cached average ms | Bypassed average ms | Cached p95 ms | Bypassed p95 ms | Cached p99 ms | Bypassed p99 ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `catalogue/list` | 998 | 1029 | 9.71 | 14.50 | 15 | 23 | 18 | 34 |
| `catalogue/search` | 407 | 371 | 9.62 | 14.58 | 15 | 22 | 19 | 30 |
| `catalogue/category` | 364 | 354 | 9.58 | 14.75 | 15 | 24 | 22 | 43 |
| `catalogue/price` | 251 | 273 | 10.34 | 15.30 | 17 | 24 | 25 | 43 |
| `catalogue/detail` | 518 | 537 | 9.71 | 13.25 | 16 | 22 | 21 | 31 |

Every endpoint group recorded zero failures in both runs. Task selection is random and weighted, so the request counts and endpoint mix differ slightly. Throughput stayed close to 12.4 requests/second in both 25-user runs. The 1–3 second wait between tasks limits offered traffic, so this is not evidence that caching cannot improve maximum throughput.

## Workload and configuration

- Script: `backend/tests/load/locustfile.py`.
- User type: Locust `HttpUser`; one HTTP request per task; `between(1, 3)` seconds of wait time after each task.
- Base endpoint: `/api/v1/catalogue/products`.
- Task weights: list 8, search 3, category 3, price 2, detail 4. Expected shares are 40%, 15%, 15%, 10%, and 20%; actual shares vary.
- Observed list parameters: `page=1&page_size=10`.
- Search term: `desk`; price filter: 0–10,000.
- Category: `0eb74e19-25f1-4b7d-9de2-2eef07d34fb0`.
- Detail slugs: `alder-sit-stand-desk`, `cedar-compact-writing-desk`, and `compact-study-desk`.
- Response checks: HTTP 200, valid JSON object, required top-level keys, and `items` being a list where expected. These are basic response checks rather than full schema or business-rule validation.
- Cached responses have a 60-second TTL. Admin catalogue writes invalidate public list/detail caches through a shared generation counter after a successful database commit.
- Cache bypass uses `CATALOGUE_CACHE_ENABLED=false` in the public product service. Redis remains running and may still log a successful startup connection. This measures bypassing catalogue caching, not a Redis outage.

The workload exercises the public catalogue API. It does not load frontend JavaScript, render pages, download all product images, or exercise authentication, checkout, or payments.

## Test procedure and reproducibility

1. Start PostgreSQL and Redis, then start the API from `E:\Deskcraft\deskcraft\backend`:

   ```powershell
   .\.venv\Scripts\python.exe run_server.py
   ```

   The Windows launcher explicitly creates a Selector event loop, which is required for this project's async Psycopg setup. Run without development auto-reload for this baseline.

2. Start Locust in a separate terminal from the same backend directory:

   ```powershell
   .\.venv-load\Scripts\python.exe -m locust -f tests/load/locustfile.py --host http://127.0.0.1:8000 --web-host 127.0.0.1
   ```

3. Open `http://127.0.0.1:8089`. Confirm a one-user smoke test succeeds before collecting baseline results.
4. For cached tests, set `CATALOGUE_CACHE_ENABLED=true` and restart the API. The instructed procedure used 10 users at 2 users/second, then 25 and 50 users at 5 users/second; warm up, reset statistics, and record approximately three minutes per run. The exports establish the recorded durations above; they do not independently verify the warm-up/reset timing or spawn-rate settings.
5. For the comparison, set `CATALOGUE_CACHE_ENABLED=false`, restart the API, and repeat the same 25-user workload. Export the HTML report and requests CSV.
6. Restore `CATALOGUE_CACHE_ENABLED=true` and restart the API for normal development. The latest supplied configuration screenshot shows the flag restored to true; a restart is required to apply any configuration change.

The reported runs last slightly more than three minutes. Use the actual durations in the results table when describing this evidence.

## Setup issue excluded from the baseline

An initial one-user test returned HTTP 500 for all 50 requests. The server traceback identified async Psycopg's incompatibility with the Windows Proactor event loop. After switching to the explicit Selector-loop launcher, a separate one-user smoke test completed 55 requests with zero failures. Neither the failed setup run nor the successful smoke test is included in the four baseline runs above.

## Validation

The developer reported that Ruff checks, formatting checks, and pytest passed after the implementation changes. Those checks were run on the developer's machine; they were not independently executed while preparing this report. The current pytest count and execution time were not recorded.

HTML totals were checked against the uploaded requests CSVs for the 25-user cached, 50-user cached, and 25-user bypassed runs. No requests CSV was supplied for the 10-user run. Endpoint request counts sum to each report's aggregate total.

## Limitations and environment gaps

- One measured run per configuration; no repeated-run confidence intervals.
- Local development dataset and localhost networking. Current table row counts were not recorded.
- The API, load generator, PostgreSQL, and Redis used the same development machine, so they share resources.
- CPU model, RAM, current Git commit, exact installed dependency versions, and database connection-pool settings were not recorded. Record these alongside future comparisons.
- No CPU/memory utilization, database query counts, cache hit ratio, or per-request cache-hit status was measured. A cache-enabled run can include cache misses and TTL expiry.
- Wait times limit load. No saturation point or maximum sustainable throughput was established, and 50 simulated users is not a claim of 50 continuously in-flight requests.
- No production network latency, deployed infrastructure, long-duration soak, or concurrent admin-write workload was tested.

## Raw evidence

Keep these original exports beside this report, for example under `docs/performance/day66-raw/`. The original filenames identify the source runs; their filename times should not be treated as the measurement duration.

- 10 users, cache enabled:
  - `Locust_2026-11-03-16h34_locustfile.py_http___127.0.0.1_8000.html`
- 25 users, cache enabled:
  - `Locust_2026-11-03-16h42_locustfile.py_http___127.0.0.1_8000.html`
  - `Locust_2026-11-03-16h42_locustfile.py_http___127.0.0.1_8000_requests.csv`
- 50 users, cache enabled:
  - `Locust_2026-11-03-16h49_locustfile.py_http___127.0.0.1_8000.html`
  - `Locust_2026-11-03-16h49_locustfile.py_http___127.0.0.1_8000_requests.csv`
- 25 users, cache bypassed:
  - `Locust_2026-11-03-17h10_locustfile.py_http___127.0.0.1_8000.html`
  - `Locust_2026-11-03-17h10_locustfile.py_http___127.0.0.1_8000_requests.csv`

## Follow-up within the existing roadmap

Day 66 establishes the initial catalogue API baseline. Retain these reports for comparison. Day 123 measures deployed frontend performance; Day 124 adds runtime observability; Day 125 repeats load testing, identifies bottlenecks, and records before/after optimization results; Day 130 combines the evidence into the final quality and performance report.

## Technical references

- [Locust: writing a locustfile](https://docs.locust.io/en/stable/writing-a-locustfile.html)
- [Locust: configuration](https://docs.locust.io/en/stable/configuration.html)
- [Psycopg: asynchronous operations and Windows event-loop support](https://www.psycopg.org/psycopg3/docs/advanced/async.html)
