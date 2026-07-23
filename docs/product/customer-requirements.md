# DeskCraft Customer Functional Requirements

**Status:** Draft
**Date:** 23 July 2026

### 1. Customer Registration

**Customer action:**  
The customer should be able to create an account using their name, email address and password.

**Expected result:**  
DeskCraft validates the details, creates the account and allows the customer to sign in.


## 2. Authentication

**Customer action:** 
The customer should be able to login to their account using their email address and password.

**Expected result:**
DeskCraft validates the credentials and, if they are correct, logs the customer in and allows access to the protected features.


## 3. Product Catalogue

**Customer action:** 
The customer should be able to browse, search, filter and sort products.

**Expected result:**
DeskCraft provides clear product listing and filtering features based on price, category, stock availability. It further provides search and sorting features and pagination.

## 4. Product Details

**Customer action:**
The customer should be provided with ample information about the product.

**Expected result:**
DeskCraft provides product name, description, price, product specifications, product variants, stock status, add to cart feature and delivery estimate.

## 5. Cart 

**Customer action:**
The customer should be able add item to cart, remove item and be provided with necessary cart features for their hassle free shopping experience.

**Expected Result:**
DeskCraft provides cart features such as adding item to cart, removing item from cart, change quantity and recalculate totals. Price calculation is done only on the backend.

## 6. Address Management

**Customer action:**
The customer should be able to update address using address line, city, state, postal code.

**Expected Result:**
DeskCraft validates the details and store it in database, which were used to provide checkout address.

## 7. Checkout

**Customer action:**
The customer should be able to view their cart products, quantity selected, delivery estimate, price details.

**Expected Result:**
DeskCraft provides cart summary, delivery option selection, final price calculation, stock validation and payment initiation.

## 8. Payments

**Customer action:**
The customer should be able to complete a test payment securely through Razorpay during checkout.

**Expected Result:**
DeskCraft initiates the payment, verifies the payment result and displays whether it was successful or failed. An order is confirmed only after successful payment verification. If payment fails, the customer can retry without creating a duplicate order.


## 9. Orders

**Customer action:**
The customer should be able to see their order placed details and concerned information.

**Expected Result:**
DeskCraft provides details about order history, order status, ordered items info, payment status, order date, delivery address, total price and tracking link.

## 10. Shipment Tracking

**Customer action:**
The customer should be able to see current shipment status.

**Expected Result:**
DeskCraft provides tracking timeline, current shipment status,  tracking-event date and time and delivery estimate.

## 11. AI workspace assistant

**Customer action:**
The customer should be able to describe their workspace needs, including their budget, available space, intended use and product preferences.

**Expected Result:**
DeskCraft recommends suitable products that are currently available in inventory and explains how they match the customer’s needs. The recommendations display relevant product details, prices and stock availability, with links to view the recommended products.









