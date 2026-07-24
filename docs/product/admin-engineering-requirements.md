# DeskCraft Admin and Engineering Requirements

**Status:** Draft  
**Date:** 24 July 2026

## 1. Admin Authentication

**Admin action:**
Only the admin should be able to access this portal using email and password

**Expected result:**
DeskCraft validates the credentials, if they are correct, logs the admin in and allows access to admin-only protected features.

## 2. Admin Dashboard

**Admin action:**
Admin should be able to view important data such as orders, revenues, payments and inventory warnings.

**Expected result:**
DeskCraft provides essential data visualization elements used to track key performance indicators(KPIs).

## 3. Category Management

**Admin action:**
Admin should be able to edit, update, delete categories of products.

**Expected result:**
DeskCraft provides features to organize store catalogue by creating, editing and structuring product categories.

## 4. Product Management

**Admin action:**
Admin should be able to view product listing, edit/update product variants and configurations.

**Expected result:**
DeskCraft saves the product information and displays the updated products and variants in the admin product list.


## 5. Product Image Management

**Admin action:**
Admin should be able to upload product image and its variants with necessary configurations.

**Expected result:**
DeskCraft uploads and saves the images and associates them with the correct product or variant.

## 6. Inventory Management

**Admin action:**
The admin should be able to view and update the available quantity of each product variant.

**Expected result:**
DeskCraft provides in-stock quantity, low stock warnings and out-of-stock counts.


## 7. Order Management

**Admin action:**
Admin should be able view order listing and be able to find specific order using search and filter.

**Expected result:**
DeskCraft lists order's table, order states and provide search and filter options for quick search.

## 8. Shipment Management

**Admin action:**  
The admin should be able to create shipment information for an order and update its shipment status.

**Expected result:**  
DeskCraft saves the shipment details and displays the updated status to the customer through order tracking.


## 9. Payment Visibility

**Admin action:**
The admin should be able to view payment information associated with each order

**Expected result:**
DeskCraft displays the order ID, payment amount, payment status, Razorpay payment reference and payment date. The status should show whether the payment is pending, successful or failed.


# Engineering Requirements

## 10. Security

### ER-01 — Authentication and Authorization

**Requirement:**  
DeskCraft should securely authenticate customers and admins. Only authorized admins should be able to access admin features.

### ER-02 — Data Protection

**Requirement:**  
Passwords should be securely hashed, sensitive information should not be exposed, and payment results should be verified by the backend before confirming an order.

---

## 11. Performance

### ER-03 — Response Time

**Requirement:**  
Common operations such as login, product browsing, cart updates and viewing orders should normally respond within two seconds under expected v1 usage.

---

## 12. Reliability

### ER-04 — Data Consistency

**Requirement:**  
DeskCraft should keep orders, payments and inventory consistent. An order should be confirmed only after successful payment verification, and stock should not be reduced more than once for the same order.

### ER-05 — Error Handling

**Requirement:**  
DeskCraft should handle failed operations without creating duplicate orders, payments or inventory updates. Customers and admins should receive a clear error message and should be able to retry when appropriate.


