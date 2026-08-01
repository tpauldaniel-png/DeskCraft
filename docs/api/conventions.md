# DeskCraft API Conventions

## Base URL

`/api/v1`

## Resource Naming

- Use plural resource names.
- Use lowercase paths.
- Use hyphens only when necessary.
- Use UUIDs for resource identifiers.

Examples:

- `GET /api/v1/products`
- `GET /api/v1/products/{product_id}`
- `POST /api/v1/cart/items`
- `GET /api/v1/orders/{order_id}`

## HTTP Methods

- `GET` — Retrieve data
- `POST` — Create data
- `PATCH` — Partially update data
- `DELETE` — Remove data

## Status Codes

- `200 OK` — Successful request
- `201 Created` — Resource created
- `204 No Content` — Successful deletion
- `400 Bad Request` — Invalid operation
- `401 Unauthorized` — Authentication required
- `403 Forbidden` — Insufficient permission
- `404 Not Found` — Resource not found
- `409 Conflict` — Stock or duplicate conflict
- `422 Unprocessable Entity` — Validation failure
- `500 Internal Server Error` — Unexpected server error

## JSON Naming

Use `snake_case` for request and response fields.

## Date and Time

Use UTC ISO 8601 timestamps.

Example: `2026-08-01T10:30:00Z`

## Error Response

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product does not exist",
    "details": []
  }
}
```

## Singleton Resources

Use singular paths for resources belonging to the authenticated user.

Examples:

- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `GET /api/v1/profile`

## Pagination

List endpoints use page-based pagination.

Example:

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 0
}
```