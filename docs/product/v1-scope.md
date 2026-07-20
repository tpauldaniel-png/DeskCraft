# DeskCraft Product Scope

**Status**: Frozen
**Version**: 1.0
**Start Date**: July 20, 2026
**Target Completion**: Dec 19, 2026

## 1. Product Overview

DeskCraft is a focused ergonomic-workspace e-commerce platform for
students, developers, freelancers, remote workers and home-office users.

The platform helps customers discover and purchase products for building
comfortable and productive workspaces.

**Tagline:** Build a workspace that works for you.


## 2. Target Users

### Primary users

- Students
- Software developers
- Freelancers
- Remote workers
- Home-office users

### Admin users

- Store administrators
- Catalogue managers
- Inventory managers
- Order fulfilment staff


## 3. Using MoSCoW Prioritisation technique for designing v1 scope:

DeskCraft must include:

### Customer v1 scope: 

- User Registration and Login
- Landing Page
- Product Catalogue
- Product Variants and details
- Shopping Cart
- Customer address management
- Checkout
- Razorpay test-mode payment
- Order placement
- Order history
- Shipment tracking
- Inventory-aware AI workspace recommendation assistant

### Admin v1 scope:

- Admin authentication
- Basic dashboard
- Category management
- Product management
- Product variant management
- Product image management
- Inventory management
- Order management
- Shipment management
- Payment visibility


### DeskCraft will not include this time:

- Wishlist
- Loyalty programme
- Advanced coupons
- Product reviews
- Advanced returns
- Multiple payment providers
- Multiple currencies
- Multiple languages
- Social login
- Mobile application
- Microservices
- Kubernetes
- Multi-vendor marketplace
- Multiple warehouses
- Real courier API


## 4.External Services

DeskCraft may integrate with:

- Razorpay for test-mode payments
- Cloudinary for product images
- An email provider for notifications
- OpenAI for the workspace recommendation assistant


## 5. Technical Boundaries

- Two React and TypeScript applications
- One customer application
- One admin application
- One modular FastAPI backend
- PostgreSQL as the source of truth
- Redis and Celery introduced later when required
- One GitHub repository


## 6. v1 Completion Outcome

DeskCraft v1 is complete when a customer can:

1. Create an account
2. Browse ergonomic workspace products
3. Select product variants
4. Add products to the cart
5. Provide a delivery address
6. Complete a Razorpay test payment
7. Place and view an order
8. Track the shipment
9. Receive inventory-aware workspace recommendations


## 7. Definition of Done

A DeskCraft task is complete only when:

- The feature works as expected
- Relevant tests pass
- Expected errors are handled
- Documentation is updated when necessary
- Changes are committed
- Work is reviewed
- Evidence is linked in the tracker or GitHub issue
