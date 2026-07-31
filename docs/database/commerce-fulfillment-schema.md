# Commerce and fulfillment schema

## Scope

Day 11 database design covering:

- Inventory
- Carts
- Cart items
- Orders
- Order items
- Payments
- Shipments

## Schema Diagram

![commerce-fulfillment schema](./diagrams/commerce-fulfillment-schema.svg)

## Key Relationships

- One product variant can have one inventory record.
- One user can have one cart.
- One cart can contain many cart items.
- Each cart item refers to one product variant.
- One user can place many orders.
- One order contains one or more order items.
- Each order item refers to one product variant.
- One order can have multiple payment attempts.
- One order can have one shipment.

## Important Decisions

Inventory is maintained per product variant.
Available stock is calculated as *stock_on_hand - stock_reserved*.
A cart stores only the selected variant and quantity; prices are revalidated during checkout.
Order items store product details and prices as purchase-time snapshots.
Orders store the shipping address as a snapshot.
Razorpay identifiers and payment status are stored in payments.
DeskCraft v1 supports one shipment per order.

## External References

This schema refers to the following Day 10 entities:
- Users
- Product variants

Detailed fields, datatypes and constraints are shown in the Draw.io diagram