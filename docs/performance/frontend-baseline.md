# Customer Web Performance BaseLine 

- **Date:** 9 SEPTEMBER 2026
- **Application:** Deskcraft customer-web
- **Page:** Landing Page
- **URL tested: ** http://localhost:4173/
- **Tested Build:** Production build served with Vite Preview
- **Lighthouse Version:** 13.4.1
- **Method:** Three desktop audits and three mobile audits. The median is used as the baseline.

## Desktop results

| Metric | Run 1 | Run 2 | Run 3 | Baseline Median |
| --- | --- | --- | --- | --- |
| Performance score | 73 | 75 | 75 | **75** |
| Accessibility score | 87 | 87 | 87 | **87** |
| Best practices score | 100 | 100 | 100 | **100** |
| SEO score | 75 | 75 | 75 | **75** |
| First Contentful Paint (FCP) | 0.6s | 0.5s | 0.5s | **0.5s** |
| Largest Contentful Paint (LCP) | 7.4s | 9.6s | 9.5s | **9.5s** |
| Total Blocking Time (TBT) | 120ms | 10ms | 10ms | **10ms** |
| Cumalative Layout Shift (CLS) | 0.005 | 0.002 | 0.002 | **0.002** |
| Speed Index | 0.7s | 0.5s | 0.5s | **0.5s** |
| Total network payload | 18,035KiB | 18,035KiB | 18,035KiB | **18,035KiB** |
| Estimated Image savings | 17,075KiB | 16,493KiB | 16,493KiB | **16,493KiB** |

## Mobile results

| Metric | Run 1 | Run 2 | Run 3 | Baseline Median |
| --- | --- | --- | --- | --- |
| Performance score | 67 | 66 | 67 | **67** |
| Accessibility score | 81 | 81 | 81 | **81** |
| Best practices score | 100 | 100 | 100 | **100** |
| SEO score | 75 | 75 | 75 | **75** |
| First Contentful Paint (FCP) | 2.8s | 2.8s | 2.8s | **2.8s** |
| Largest Contentful Paint (LCP) | 58.4s | 74.1s | 58.4s | **58.4s** |
| Total Blocking Time (TBT) | 230ms | 220ms | 200ms | **220ms** |
| Cumalative Layout Shift (CLS) | 0.007 | 0.007 | 0.007 | **0.007** |
| Speed Index | 2.8s | 3.0s | 2.8s | **2.8s** |
| Total network payload | 18,267KiB | 27,398KiB | 18,267KiB | **18,267KiB** |
| Estimated Image savings | 17,660KiB | 26,623KiB | 17,660KiB | **17,660KiB** |

## Production Build sizes 

| Asset | Minified size | Gzip size |
| --- | --- | --- |
| JavaScript bundle | 644.08 kB | 206.05kB |
| CSS bundle | 61.81 kB | 11.27 kB |
| Largest Vite-managed image | 1,882.87 kB | - |
| Largest Landing page image reported by Lighthouse | 2,142 KiB | - |


## Initial Observations

-  Images are the largest performance problem.
-  Mobile LCP is critically slow.
-  Desktop LCP also needs improvement.
-  Layout stability is already good.
-  JavaScript blocking time is acceptable.
-  Mobile accessibility need improvement.



# Customer Web Performance Optimization

- **Date:** 10 SEPTEMBER 2026
- **Application:** Deskcraft customer-web
- **Page:** Landing Page
- **URL tested: ** http://localhost:4173/
- **Tested Build:** Production build served with Vite Preview
- **Lighthouse Version:** 13.4.1
- **Method:** Three desktop audits and three mobile audits. The median is used as the final result.

## Final desktop results

| Metric | Run 1 | Run 2 | Run 3 | Final Median |
| --- | --- | --- | --- | --- |
| Performance score | 99 | 99 | 99 | **99** |
| Accessibility score | 96 | 96 | 96 | **96** |
| Best practices score | 100 | 100 | 100 | **100** |
| SEO score | 100 | 100 | 100 | **100** |
| First Contentful Paint (FCP) | 0.5s | 0.5s | 0.5s | **0.5s** |
| Largest Contentful Paint (LCP) | 0.7s | 0.7s | 0.8s | **0.7s** |
| Total Blocking Time (TBT) | 0ms | 0ms | 0ms | **0ms** |
| Cumalative Layout Shift (CLS) | 0.002 | 0.002 | 0.002 | **0.002** |
| Speed Index | 0.5s | 0.5s | 0.5s | **0.5s** |
| Total network payload | 710KiB | 710KiB | 710KiB | **710KiB** |

## Final Mobile results

| Metric | Run 1 | Run 2 | Run 3 | Final Median |
| --- | --- | --- | --- | --- |
| Performance score | 90 | 90 | 90 | **90** |
| Accessibility score | 91 | 91 | 91 | **91** |
| Best practices score | 100 | 100 | 100 | **100** |
| SEO score | 100 | 100 | 100 | **100** |
| First Contentful Paint (FCP) | 2.3s | 2.3s | 2.3s | **2.3s** |
| Largest Contentful Paint (LCP) | 3.2s | 3.2s | 3.2s | **3.2s** |
| Total Blocking Time (TBT) | 70ms | 60ms | 50ms | **60ms** |
| Cumalative Layout Shift (CLS) | 0.007 | 0.007 | 0.007 | **0.007** |
| Speed Index | 2.3s | 2.3s | 2.3s | **2.3s** |
| Total network payload | 627KiB | 627KiB | 627KiB | **627KiB** |

## Before and after comparison

| Metric | Desktop Baseline | Desktop Final | Mobile Baseline | Mobile Final |
| --- | --- | --- | --- | --- |
| Performance score | 75 | **99** | 67 | **90** |
| Accessibility score | 87 | **96** | 81 | **91** |
| Best practices score | 100 | **100** | 100 | **100** |
| SEO score | 75 | **100**** | 75 | **100** |
| First Contentful Paint (FCP) | 0.5s | **0.5s** | 2.8s | **2.3s** |
| Largest Contentful Paint (LCP) | 9.5s | **0.7s** | 58.4s | **3.2s** |
| Total Blocking Time (TBT) | 10ms | **0ms**** | 220ms | **60ms** |
| Cumalative Layout Shift (CLS) | 0.002 | **0.002** | 0.007 | **0.007** |
| Speed Index | 0.5s | **0.5s** | 2.8s | **2.3s** |
| Total network payload | 18,035KiB | 710KiB | 18,267KiB | **627KiB** |


## Optimizations completed

- Converted landing-page PNG images to optimized WebP files.
- Added seperate desktop and mobile hero images.
- Added explicit image dimensions, lazy loading and asynchronous decoding.
- Removed unused PNG files from production asset directories.
- Added title, description, robots and other SEO metadata.
- Added route level code splitting for authentication and protected pages.
- Split below the fold landing sections into a lazy loaded javascript chunk.


