# WhiffElite

## Description

WhiffElite is a hyperlocal clothing delivery platform that connects customers with nearby stores, enabling fast delivery within minutes based on location. It features role-based access for admins, customers, store owners, and delivery partners, with real-time order tracking, secure PayPal payments, and full product and order management—all built on a modern tech stack including React, Node.js, MongoDB, and Socket.IO.

## Installation

```bash
git clone https://github.com/aaditya-sambare/WhiffElite.git
cd WhiffElite
npm install
```

## Usage

1. Create a `.env` file with your database URI, API keys, and other environment-specific settings.
2. Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:3000`.

## API Routes

### Admin Routes

- `GET /api/admin/products`: Get all products
- `POST /api/admin/products`: Create new product
- `PUT /api/admin/products/:id`: Update product
- `DELETE /api/admin/products/:id`: Delete product
- `GET /api/admin/orders`: Get all orders
- `GET /api/admin/orders/:id`: Get a specific order by ID
- `PUT /api/admin/orders/:id/status`: Update order status
- `DELETE /api/admin/orders/:id`: Delete order
- `GET /api/admin/users`: Get all users
- `POST /api/admin/users`: Create new user
- `PUT /api/admin/users/:id`: Update user
- `DELETE /api/admin/users/:id`: Delete user

### Store Routes

- `GET /api/products`: Get all available products
- `GET /api/products/:id`: Get product by ID
- `POST /api/cart`: Add product to cart
- `PUT /api/cart/:id`: Update cart
- `DELETE /api/cart/:id`: Remove product from cart
- `POST /api/checkout`: Proceed to checkout
- `PUT /api/checkout/:id/pay`: Update payment status
- `POST /api/checkout/:id/finalize`: Finalize the order

### Order Routes

- `POST /api/orders`: Place a new order
- `GET /api/orders/:id`: Get order details by ID
- `GET /api/orders`: Get all orders for a user

---

## User API Documentation

This documentation covers all backend API endpoints related to User management in your WhiffElite application. It includes registration, login, profile retrieval, logout, and location update. Each endpoint is described with its purpose, HTTP method, request/response structure, and usage examples.

### 1. Register User

**Endpoint:**  
`/api/users/register`  
**HTTP Method:** `POST`

**Description:**  
Registers a new user. Validates email, firstname, and password. Returns the created user and JWT token.

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "contact": "9876543210"
}
```

**Example Response:**

```json
{
  "user": {
    "_id": "663e2e7b8f1b2c0012a4e1c9",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "contact": "9876543210",
    "role": "customer",
    "profileImage": "https://ui-avatars.com/api/?name=User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login User

**Endpoint:**  
`/api/users/login`  
**HTTP Method:** `POST`

**Description:**  
Authenticates a user using email and password. Returns user details and JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Example Response:**

```json
{
  "user": {
    "_id": "663e2e7b8f1b2c0012a4e1c9",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "contact": "9876543210",
    "role": "customer",
    "profileImage": "https://ui-avatars.com/api/?name=User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get User Profile

**Endpoint:**  
`/api/users/profile`  
**HTTP Method:** `GET`

**Description:**  
Fetches the profile of the currently authenticated user. Requires authentication (JWT token in header or cookie).

**Headers:**

```
Authorization: Bearer <token>
```

**Example Response:**

```json
{
  "_id": "663e2e7b8f1b2c0012a4e1c9",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "contact": "9876543210",
  "role": "customer",
  "profileImage": "https://ui-avatars.com/api/?name=User",
  "location": {
    "type": "Point",
    "coordinates": [0, 0],
    "name": ""
  }
}
```

---

### 4. Logout User

**Endpoint:**  
`/api/logout`  
**HTTP Method:** `GET`

**Description:**  
Logs out the current user by blacklisting the JWT token and clearing the cookie.

**Headers:**

```
Authorization: Bearer <token>
```

**Example Response:**

```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Update User Location

**Endpoint:**  
`/api/users/location`  
**HTTP Method:** `PUT`

**Description:**  
Updates the user's location (coordinates and name). Requires authentication.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716],
    "name": "Bangalore, India"
  }
}
```

**Example Response:**

```json
{
  "_id": "663e2e7b8f1b2c0012a4e1c9",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "contact": "9876543210",
  "role": "customer",
  "profileImage": "https://ui-avatars.com/api/?name=User",
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716],
    "name": "Bangalore, India"
  }
}
```

---

## User Flow

1. **Registration:**  
   User sends a POST request to `/api/users/register` with required details. Receives user info and JWT token.

2. **Login:**  
   User sends a POST request to `/api/users/login` with email and password. Receives user info and JWT token.

3. **Profile Access:**  
   User includes the JWT token in the `Authorization` header and sends a GET request to `/api/users/profile` to fetch their profile.

4. **Logout:**  
   User sends a GET request to `/api/logout` with the JWT token to invalidate the session.

5. **Location Update:**  
   User sends a PUT request to `/api/users/location` with new location data and JWT token to update their location.

---

## Error Handling

- **Validation Errors:**  
  Returns `422` or `400` with error details if input is invalid.

- **Authentication Errors:**  
  Returns `401` if token is missing, invalid, or blacklisted.

- **Duplicate User:**  
  Returns `400` if email or contact already exists.

---

## Example Usage (cURL)

**Register:**

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstname":"John","lastname":"Doe","email":"john@example.com","password":"password123","contact":"9876543210"}'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Profile:**

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <token>"
```

**Logout:**

```bash
curl -X GET http://localhost:5000/api/logout \
  -H "Authorization: Bearer <token>"
```

**Update Location:**

```bash
curl -X PUT http://localhost:5000/api/users/location \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"location":{"type":"Point","coordinates":[77.5946,12.9716],"name":"Bangalore, India"}}'
```

---

## Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for Authentication
- PayPal SDK for payments
