# Data dictionary 

This serves as a single source of truth that helps to understand the context, format and meaning of deskcraft data.

## Constraints 
| Constraint shorthand | Constraint name |
|---|---|
| PK | Primary Key |
| FK | Foreign Key |
| UQ | Unique |
| NN | Not Nullable |


## Users

| Field | Type | Constraints | Description |
|---|---|---|---|
| user_id | UUID | PK | Unique user identifier |
| first_name | VARCHAR(100) | NN | first name of user |
| last_name | VARCHAR(100) | NN | last name of user |
| email | VARCHAR(255) | UQ,NN | User login email |
| phone_number | VARCHAR(20) | UQ, NULL ALLOWED | User's phone number |
| password_hash | VARCHAR(255) | NN | Hashed password |
| role | VARCHAR(20)| NN, DEFAULT `'customer'` | User's authorization role |
| is_active | BOOLEAN | NN, DEFAULT TRUE | Whether the account is active |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last account update time |


**Rules:**
- Role must be either 'customer' or 'admin'




## Addresses

| Field | Type | Constraints | Description |
|---|---|---|---|
| address_id | UUID | PK | Unique address identifier |
| user_id | UUID | NN, FK-> `users.user_id` | User who owns the address |
| recipient_name | VARCHAR(100) | NN | Name of the recipient |
| phone_number | VARCHAR(20) | NN | Phone number of recipient |
| address_line1 | VARCHAR(200) | NN | main address info |
| address_line2 | VARCHAR(200) | NULL ALLOWED | Extra address info |
| city | VARCHAR(100) | NN | City of the recipient |
| state | VARCHAR(100) | NN | Indian state of the recipient |
| postal_code | VARCHAR(20) | NN | six digit postal code of india |
| country | VARCHAR(50) | NN, DEFAULT `INDIA` | country name |
| is_default | BOOLEAN | NN, DEFAULT `FALSE` | Whether to set this address as default address |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | Address creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last address update time |


**Relationship:**
- One user can have zero or many addresses, and each address belongs to exactly one user.


## Categories 

| Field | Type | Constraints | Description |
|---|---|---|---|
| category_id | UUID | PK | Unique category identifier |
| name | VARCHAR(100) | UQ, NN | Unique category name |
| description | TEXT | NULL ALLOWED | Description about category |
| is_active | BOOLEAN | NN, DEFAULT `TRUE` | Whether the category is active |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | Category creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last category update time |


## Products 

| Field | Type | Constraints | Description |
|---|---|---|---|
| product_id | UUID | PK | Unique product identifier |
| category_id | UUID | NN, FK-> `categories.category_id` | Product which belongs to this category |
| name | VARCHAR(200) | NN | Product name |
| slug | VARCHAR(200) | NN, UQ | Human readable product unique identifier |
| description | TEXT| NULL ALLOWED | Description about the product |
| specification | JSONB | NULL ALLOWED | Specification about the product |
| is_active | BOOLEAN | NN, DEFAULT `TRUE` | Whether the product is active |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | product creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last product update time |

**Relationship:**
- One category can have zero or many products, and every product belongs to exactly one category.


## Product variants 
| Field | Type | Constraints | Description |
|---|---|---|---|
| variant_id | UUID | PK | Unique product variant identifier |
| product_id | UUID | NN, FK -> `products.product_id` | Product to which the variant belongs |
| name | VARCHAR(200) | NN | Product variant name |
| price | NUMERIC(10,2) | NN | Price of the product variant |
| sku | VARCHAR(100) | NN, UQ | Unique tracking code of product variant |
| is_active | BOOLEAN | NN, DEFAULT `TRUE` | Whether the product variant is active |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | product variant creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last product variant update time |

**Relationship:**
- Each variant belongs to exactly one product.
- One product can have zero or many variants while it is being prepared.
- Before a product is made available to customers, it should have at least one active variant.

**Rules:**
- `CHECK (price >= 00`


## Product images

| Field | Type | Constraints | Description |
|---|---|---|---|
| product_image_id | UUID | PK | Unique image identifier |
| variant_id | UUID | NN, FK -> `product_variants.variant_id` | Product variant to which the image belongs |
| image_url | TEXT | NN | url of the product variant image |
| cloudinary_id | VARCHAR(255) | NULL ALLOWED | Cloudinary id of the image |
| alt_text | VARCHAR(255) | NN | alternate text for the image |
| sort_order | INTEGER | NN, DEFAULT `0` | To control gallery order |
| is_primary | BOOLEAN | NN, DEFAULT `FALSE`| To identify the main image |
| is_active | BOOLEAN | NN, DEFAULT `TRUE` | Whether the image is active |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | image creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last image update time |

**Relationship:**
- Each product image belongs to exactly one variant.
- One variant can have zero or many images.

## Inventory 

| Field | Type | Constraints | Description |
|---|---|---|---|
| inventory_id | UUID | PK | Unique inventory identifier |
| variant_id | UUID | NN, UQ, FK -> `product_variants.variant_id` | Product variant which belongs to this inventory |
| stock_on_hand | INTEGER | NN, DEFAULT `0` | total product variants present in the system |
| stock_reserved | INTEGER | NN, DEFAULT `0` | product variants set aside for pending customer orders |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | inventory creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last inventory update time |

**Relationship:**
- Each inventory record belongs to exactly one variant.
- A variant may initially have no inventory record.
- A variant can have at most one inventory record.

**Rules:**
- `CHECK (stock_on_hand >= 0)`
- `CHECK (stock_reserved >= 0)`
- `CHECK (stock_reserved <= stock_on_hand)`
- available_stock = stock_on_hand - stock_reserved


## Carts

| Field | Type | Constraints | Description |
|---|---|---|---|
| cart_id | UUID | PK | Unique cart identifier |
| user_id | UUID | NN, UQ, FK -> `users.user_id` | User to which the cart belongs |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | cart creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last cart update time |

**Relationship:**
- A user may initially have no cart record.
- A variant can have at most one cart record.
- Each cart belongs to exactly one user.

## Cart Items
| Field | Type | Constraints | Description |
|---|---|---|---|
| cart_item_id | UUID | PK | Unique cart item identifier |
| cart_id | UUID | NN, FK -> `carts.cart_id` | Cart to which the cart item belongs |
| variant_id | UUID | NN, FK -> `product_variants.variant_id` | Variant to which the cart item belongs |
| quantity | INTEGER | NN, DEFAULT `1` | Quantity of the cart item |
| created_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | cart item creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT CURRENT_TIMESTAMP | last cart item update time |

**Relationship:**
- One cart can have zero or many cart items; each cart item belongs to exactly one cart.
- One product variant can appear in zero or many cart items; each cart item references exactly one product variant.

**Rules:**

- `UNIQUE (cart_id, variant_id)`
- `CHECK (quantity > 0)`


## Orders

| Field | Type | Constraints | Description |
|---|---|---|---|
| order_id | UUID | PK | Unique order identifier |
| order_number | VARCHAR(30) | NN, UQ | Human readable unique order identifier |
| user_id | UUID | NN, FK -> `users.user_id` | User to which the order belongs |
| shipping_address | JSONB | NN | Shipping address snapshot at the checkout |
| status | VARCHAR(30) | NN, DEFAULT `'pending'` | Current order status |
| total_price | NUMERIC(10,2) | NN | Total order price |
| created_at | TIMESTAMPTZ | NN, DEFAULT `CURRENT_TIMESTAMP` | Order creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT `CURRENT_TIMESTAMP` | Last order update time |


**Rules:**

- `CHECK (total_price >= 0)`
- `status` must be one of: `pending`, `confirmed`, `shipped`, `delivered`, or `cancelled`.

**Relationship:**

- One user can place zero or many orders.
- Each order belongs to exactly one user.

## Order items

| Field | Type | Constraints | Description |
|---|---|---|---|
| order_item_id | UUID | PK | Unique order item identifier |
| order_id | UUID | NN, FK -> `orders.order_id` | Order to which the order item belongs |
| variant_id | UUID | NN, FK -> `product_variants.variant_id` | Variant to which the order item belongs |
| product_name | VARCHAR(200) | NN | Product name of the order item |
| variant_name | VARCHAR(100) | NN | Variant name of the order item |
| sku | VARCHAR(100) | NN | Unique tracking code the product variant to which the order item belongs |
| quantity | INTEGER | NN | quantity of the order item |
| unit_price | NUMERIC(10,2) | NN | Price per each order item |
| created_at | TIMESTAMPTZ | NN, DEFAULT `CURRENT_TIMESTAMP` | Order item creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT `CURRENT_TIMESTAMP` | Last order item update time |


**Relationship:**
- Every order must contain at least one order item, and every order item belongs to exactly one order.

**Rules:**

- `UNIQUE (order_id, variant_id)`
- `CHECK (quantity > 0)`


## Payments

| Field | Type | Constraints | Description |
|---|---|---|---|
| payment_id | UUID | PK | Unique payment identifier |
| order_id | UUID | NN, FK → `orders.order_id` | Order associated with the payment attempt |
| amount | NUMERIC(10,2) | NN | Amount processed through the payment provider |
| currency | VARCHAR(3) | NN, DEFAULT `'INR'` | Currency used for the payment |
| status | VARCHAR(30) | NN, DEFAULT `'created'` | Current payment status |
| razorpay_order_id | VARCHAR(255) | NN, UQ | Order identifier generated by Razorpay |
| razorpay_payment_id | VARCHAR(255) | UQ, NULL allowed | Payment identifier generated after payment |
| payment_method | VARCHAR(50) | NULL allowed | Payment method used by the customer |
| failure_reason | TEXT | NULL allowed | Reason for payment failure |
| paid_at | TIMESTAMPTZ | NULL allowed | Time at which the payment succeeded |
| created_at | TIMESTAMPTZ | NN, DEFAULT `CURRENT_TIMESTAMP` | Payment record creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT `CURRENT_TIMESTAMP` | Last payment record update time |

**Rules:**

- `CHECK (amount >= 0)`
- `status` must be one of: `created`, `authorized`, `captured`, `failed`, or `refunded`.
- `razorpay_payment_id` and `paid_at` can remain null until payment succeeds.
- Do not make `order_id` unique because an order can have multiple payment attempts.

**Relationship:**

- One order can have zero or many payment attempts.
- Each payment belongs to exactly one order.


## Shipments

| Field | Type | Constraints | Description |
|---|---|---|---|
| shipment_id | UUID | PK | Unique shipment identifier |
| order_id | UUID | NN, UQ, FK → `orders.order_id` | Order associated with the shipment |
| status | VARCHAR(30) | NN, DEFAULT `'processing'` | Current shipment status |
| tracking_number | VARCHAR(100) | UQ, NULL allowed | Unique shipment-tracking number |
| carrier | VARCHAR(100) | NULL allowed | Delivery service handling the shipment |
| estimated_delivery_date | DATE | NULL allowed | Expected delivery date |
| shipped_at | TIMESTAMPTZ | NULL allowed | Time at which the order was shipped |
| delivered_at | TIMESTAMPTZ | NULL allowed | Time at which the order was delivered |
| created_at | TIMESTAMPTZ | NN, DEFAULT `CURRENT_TIMESTAMP` | Shipment record creation time |
| updated_at | TIMESTAMPTZ | NN, DEFAULT `CURRENT_TIMESTAMP` | Last shipment record update time |

**Rules:**

- `status` must be one of: `processing`, `packed`, `shipped`, `out_for_delivery`, `delivered`, or `cancelled`.
- `order_id` is unique because DeskCraft v1 supports one shipment per order.
- Tracking information can remain null until the order is assigned to a carrier.

**Relationship:**

- One order can have zero or one shipment.
- Each shipment belongs to exactly one order.