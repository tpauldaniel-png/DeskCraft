## Performance docuementation --day 62 -- inline with category query baseline

- Added a product-name trigram GIN index, an active-variant product/price index, and a variant-image display-order index. 
- Updated model metadata and enabled pg_trgm in the test setup.
- Migration applied successfully; 
- Alembic detected no pending changes; Ruff issues were fixed; all 40 tests passed. 
- The inspected queries continued using sequential scans on the small dataset, so index performance benefits remain unproven.