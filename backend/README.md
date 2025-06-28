# WhiffElite Backend API Documentation

## Overview

WhiffElite is a hyperlocal, intercity e-commerce platform for clothing delivery. The backend is built with Node.js, Express, MongoDB, and Socket.IO, supporting multiple user roles: **Customer, Store Owner, Captain (Delivery Partner), and Admin**. This document describes the complete backend API flow, including user registration, product selection, order placement, ride management, real-time tracking, and admin/store owner management.

---

## Table of Contents

- [User Flow](#user-flow)
- [Product Flow](#product-flow)
- [Order & Checkout Flow](#order--checkout-flow)
- [Ride & Delivery Flow](#ride--delivery-flow)
- [Tracking & Live Location](#tracking--live-location)
- [Admin Management](#admin-management)
- [Store Owner Management](#store-owner-management)
- [API Endpoints (Detailed)](#api-endpoints-detailed)
- [Example Usage (cURL)](#example-usage-curl)
- [Complete Flow Example](#complete-flow-example)
- [Technologies Used](#technologies-used)

---

## User Flow

### Register User

- **Endpoint:** `/api/users/register`
- **Description:** Registers a new user and returns a JWT token.
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "contact": "9876543210"
  }
  ```
- **Example Response:**
  ```json
  {
    "user": {
      "_id": "663e2e7b8f1b2c0012a4e1c9",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "contact": "9876543210",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Login User

- **Endpoint:** `/api/users/login`
- **Description:** Authenticates a user and returns user details and JWT token.
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Example Response:** _Same as Register User_

### Get User Profile

- **Endpoint:** `/api/users/profile`
- **Description:** Fetches the profile of the authenticated user.
- **HTTP Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "_id": "663e2e7b8f1b2c0012a4e1c9",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "contact": "9876543210",
    "role": "customer",
    "location": {
      "type": "Point",
      "coordinates": [0, 0],
      "name": ""
    }
  }
  ```

### Update User Location

- **Endpoint:** `/api/users/location`
- **Description:** Updates the user's location.
- **HTTP Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "location": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716],
      "name": "Bangalore, India"
    }
  }
  ```
- **Example Response:** _Same as Get User Profile, with updated location_

---

## Product Flow

### Get All Products

- **Endpoint:** `/api/products`
- **Description:** Retrieves all products, supports filters via query params.
- **HTTP Method:** `GET`
- **Example Response:**
  ```json
  [
    {
      "_id": "productId",
      "name": "T-Shirt",
      "price": 499,
      "sizes": ["S", "M", "L"],
      "colors": ["Red", "Blue"],
      "store": "storeId"
    }
  ]
  ```

### Get Product by ID

- **Endpoint:** `/api/products/:id`
- **Description:** Retrieves a single product by its ID.
- **HTTP Method:** `GET`
- **Example Response:** _Single product object_

### Add to Cart

- **Endpoint:** `/api/cart`
- **Description:** Adds a product to the user's or guest's cart.
- **HTTP Method:** `POST`
- **Request Body:**
  ```json
  {
    "productId": "productId",
    "quantity": 2,
    "size": "M",
    "color": "Red",
    "userId": "userId",
    "guestId": "guest_123"
  }
  ```
- **Example Response:** _Cart object with products_

### Update Cart

- **Endpoint:** `/api/cart/:id`
- **Description:** Updates a cart item (quantity, size, color).
- **HTTP Method:** `PUT`
- **Request Body:** _Similar to Add to Cart_
- **Example Response:** _Updated cart object_

### Remove from Cart

- **Endpoint:** `/api/cart/:id`
- **Description:** Removes a product from the cart.
- **HTTP Method:** `DELETE`
- **Example Response:** _Updated cart object_

---

## Order & Checkout Flow

### Create Checkout (Place Order)

- **Endpoint:** `/api/checkout`
- **Description:** Creates a checkout session for the user.
- **HTTP Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "checkoutItems": [
      { "productId": "productId", "quantity": 1, "size": "M", "color": "Red" }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Bangalore",
      "state": "KA",
      "zip": "560001"
    },
    "paymentMethod": "PayPal",
    "totalPrice": 1000,
    "deliveryCharge": 50
  }
  ```
- **Example Response:** _Checkout session object_

### Pay for Order

- **Endpoint:** `/api/checkout/:id/pay`
- **Description:** Updates checkout to mark as paid after payment.
- **HTTP Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "paymentStatus": "paid",
    "paymentDetails": { "transactionId": "txn_123" }
  }
  ```
- **Example Response:** _Updated checkout session_

### Finalize Order

- **Endpoint:** `/api/checkout/:id/finalize`
- **Description:** Finalizes checkout, creates an order, and triggers ride creation.
- **HTTP Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Example Response:** _Order object_

### Get My Orders

- **Endpoint:** `/api/orders/my-orders`
- **Description:** Retrieves all orders for the logged-in user.
- **HTTP Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Example Response:** _Array of order objects_

### Get Order by ID

- **Endpoint:** `/api/orders/:id`
- **Description:** Retrieves a specific order by ID.
- **HTTP Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Example Response:** _Order object with ride and status info_

---

## Ride & Delivery Flow

### Create Ride

- **Endpoint:** `/api/rides/create`
- **Description:** Creates a ride for an order (usually triggered automatically).
- **HTTP Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "pickup": "Store Address",
    "destination": "Customer Address",
    "vehicleType": "bike",
    "orderId": "orderId"
  }
  ```
- **Example Response:** _Ride object_

### Store Owner Accepts Ride

- **Endpoint:** `/api/rides/store-owner-accept`
- **Description:** Store owner accepts the ride for pickup.
- **HTTP Method:** `POST`
- **Headers:** `Authorization: Bearer <storeOwnerToken>`
- **Request Body:**
  ```json
  { "rideId": "rideId" }
  ```
- **Example Response:**
  ```json
  { "message": "Ride accepted by store owner." }
  ```

### Captain Accepts Ride

- **Endpoint:** `/api/rides/captain-accept`
- **Description:** Captain accepts the ride for delivery.
- **HTTP Method:** `POST`
- **Headers:** `Authorization: Bearer <captainToken>`
- **Request Body:**
  ```json
  { "rideId": "rideId" }
  ```
- **Example Response:**
  ```json
  { "message": "Ride accepted by captain." }
  ```

### Store OTP Verification (Pickup)

- **Endpoint:** `/api/rides/verify-store-otp`
- **Description:** Captain verifies pickup at store using OTP.
- **HTTP Method:** `POST`
- **Headers:** `Authorization: Bearer <captainToken>`
- **Request Body:**
  ```json
  { "rideId": "rideId", "otp": "123456" }
  ```
- **Example Response:**
  ```json
  { "message": "OTP verified, ride started", "ride": { ... } }
  ```

### Customer OTP Verification (Delivery)

- **Endpoint:** `/api/rides/confirm-delivery`
- **Description:** Captain verifies delivery at customer using OTP.
- **HTTP Method:** `POST`
- **Headers:** `Authorization: Bearer <captainToken>`
- **Request Body:**
  ```json
  { "rideId": "rideId", "otp": "654321" }
  ```
- **Example Response:**
  ```json
  { "message": "Delivery confirmed", "ride": { ... } }
  ```

---

## Tracking & Live Location

### Get Fare Estimate

- **Endpoint:** `/api/rides/get-fare?pickup=...&destination=...`
- **Description:** Returns fare estimate for a ride.
- **HTTP Method:** `GET`
- **Example Response:**
  ```json
  { "bike": 50, "scooty": 40, "ev": 35 }
  ```

### Track Ride (for Captain)

- **Endpoint:** `/api/rides/current-for-captain`
- **Description:** Get current ride assigned to captain.
- **HTTP Method:** `GET`
- **Headers:** `Authorization: Bearer <captainToken>`
- **Example Response:** _Ride object_

### Track Ride (for Store Owner)

- **Endpoint:** `/api/rides/pending-for-store-owner`
- **Description:** Get rides pending for store owner acceptance.
- **HTTP Method:** `GET`
- **Headers:** `Authorization: Bearer <storeOwnerToken>`
- **Example Response:** _Array of ride objects_

### Live Location

- **Description:** Real-time ride and order status updates are sent via Socket.IO. Captains send live location updates to backend, which are broadcast to users and store owners.

---

## Admin Management

Admins can manage users, products, orders, stores, and view analytics.

### Example: Get All Users

- **Endpoint:** `/api/admin/users`
- **Description:** Get all users (customers, store owners, captains).
- **HTTP Method:** `GET`
- **Headers:** `Authorization: Bearer <adminToken>`
- **Example Response:** _Array of user objects_

### Example: Update Order Status

- **Endpoint:** `/api/admin/orders/:id`
- **Description:** Update order status (e.g., delivered, cancelled).
- **HTTP Method:** `PUT`
- **Headers:** `Authorization: Bearer <adminToken>`
- **Request Body:**
  ```json
  { "status": "delivered" }
  ```
- **Example Response:** _Updated order object_

---

## Store Owner Management

Store owners can manage their stores, products, orders, and rides.

### Example: Add Product

- **Endpoint:** `/api/products/store/:storeId`
- **Description:** Add a new product to a store.
- **HTTP Method:** `POST`
- **Headers:** `Authorization: Bearer <storeOwnerToken>`
- **Request Body:**
  ```json
  {
    "name": "T-Shirt",
    "price": 499,
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue"]
  }
  ```
- **Example Response:** _Product object_

### Example: Get Store Orders

- **Endpoint:** `/api/store-owner/my-orders`
- **Description:** Get all orders for the store owner's stores.
- **HTTP Method:** `GET`
- **Headers:** `Authorization: Bearer <storeOwnerToken>`
- **Example Response:** _Array of order objects_

---

## Example Usage (cURL)

**Register User**

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstname":"John","lastname":"Doe","email":"john@example.com","password":"password123","contact":"9876543210"}'
```

**Add to Cart**

```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId":"<productId>","quantity":1,"size":"M","color":"Red"}'
```

**Place Order**

```bash
curl -X POST http://localhost:5000/api/checkout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"checkoutItems":[...],"shippingAddress":{...},"paymentMethod":"PayPal","totalPrice":100,"deliveryCharge":10}'
```

---

## Complete Flow Example

1. **User registers/logs in and sets location.**
2. **User browses products, adds to cart, and checks out.**
3. **Order is created and payment is processed.**
4. **Ride is automatically created for the order.**
5. **Store owner accepts the ride for pickup.**
6. **Captain accepts the ride for delivery.**
7. **Captain verifies pickup at store (OTP).**
8. **Captain delivers to customer and verifies delivery (OTP).**
9. **Order status updates throughout the process.**
10. **User, store owner, and admin can track order and ride status in real time.**
11. **Admin and store owner can manage products, orders, and stores via their respective endpoints.**

---

## Technologies Used

- Node.js, Express.js
- MongoDB + Mongoose
- JWT for Authentication
- Socket.IO for real-time updates
- PayPal SDK for payments

---
