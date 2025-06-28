// generate-readme.js

/**
 * @description
 * This script generates a README.md file for the WhiffElite project.
 * The README includes:
 * 1. Project Title
 * 2. Description
 * 3. Installation
 * 4. Usage
 * 5. API Routes (Admin, Orders, etc.)
 * 6. Technologies Used
 */

const fs = require("fs");

const readmeContent = `
# WhiffElite

## Description
WhiffElite is a hyperlocal, intercity q-commerce platform for clothing delivery. The backend is built with Node.js, Express, MongoDB, and Socket.IO, supporting multiple user roles: Customer, Store Owner, Captain (Delivery Partner), and Admin. The platform enables user registration, product selection, order placement, ride management, real-time tracking, and admin/store owner management.

## Installation
\`\`\`bash
git clone https://github.com/aaditya-sambare/WhiffElite.git
cd WhiffElite/backend
npm install
\`\`\`

## Usage
1. Create a \`.env\` file in the \`/backend\` directory with your database URI, JWT secret, and other environment-specific settings.
2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`
The server will be running at \`http://localhost:9000\`.

## API Routes

### User Routes
- \`POST /api/users/register\` — Register a new user
- \`POST /api/users/login\` — Login an existing user
- \`GET /api/users/profile\` — Get user profile
- \`PUT /api/users/location\` — Update user location

### Product & Cart Routes
- \`GET /api/products\` — Get all products
- \`GET /api/products/:id\` — Get product by ID
- \`POST /api/cart\` — Add product to cart
- \`PUT /api/cart/:id\` — Update cart item
- \`DELETE /api/cart/:id\` — Remove product from cart

### Order & Checkout Routes
- \`POST /api/checkout\` — Create checkout (place order)
- \`PUT /api/checkout/:id/pay\` — Mark checkout as paid
- \`POST /api/checkout/:id/finalize\` — Finalize checkout and create order
- \`GET /api/orders/my-orders\` — Get all orders for the user
- \`GET /api/orders/:id\` — Get order by ID

### Ride & Delivery Routes
- \`POST /api/rides/create\` — Create a ride for an order
- \`POST /api/rides/store-owner-accept\` — Store owner accepts ride
- \`POST /api/rides/captain-accept\` — Captain accepts ride
- \`POST /api/rides/verify-store-otp\` — Captain verifies pickup at store (OTP)
- \`POST /api/rides/confirm-delivery\` — Captain verifies delivery at customer (OTP)
- \`GET /api/rides/get-fare\` — Get fare estimate

### Admin Routes
- \`GET /api/admin/users\` — Get all users
- \`PUT /api/admin/orders/:id\` — Update order status

### Store Owner Routes
- \`POST /api/products/store/:storeId\` — Add product to store
- \`GET /api/store-owner/my-orders\` — Get all store orders

## Technologies Used
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for Authentication
- Socket.IO for real-time updates
- PayPal SDK for payments

`;

fs.writeFileSync("README.md", readmeContent.trim());
console.log("✅ README.md generated for WhiffElite.");
