# Identity and Catalogue Schema

## Scope

Day 10 database design covering:

- Users
- Addresses
- Categories
- Products
- Product variants
- Product images

## Schema Diagram

![Identity and catalogue schema](./diagrams/identity-catalogue-schema%20(3).svg)

## Key Relationships

- One user can have many addresses.
- One category can have many products.
- One product can have many variants.
- One variant can have many images.

## Important Decisions

- UUIDs are used as primary keys.
- Product price belongs to product variants.
- Inventory is designed separately on Day 11.
- Product images belong to variants.
- Passwords are stored only as hashes.