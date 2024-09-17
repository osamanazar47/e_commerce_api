# E-Commerce API

Welcome to the E-Commerce API! This is a RESTful API built with Node.js, Express, MongoDB, Redis, and JWT for authentication. It supports core e-commerce functionalities including user registration, login, product management, cart management, and order processing.

## Features

- **User Authentication**: Register and log in users with JWT-based authentication.
- **Product Management**: Create, read, update, and delete products.
- **Cart Management**: Add items to the cart and view the cart.
- **Order Processing**: Place orders based on the cart contents.

## Technologies Used

- **Node.js**: JavaScript runtime for building the API.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and product data.
- **Redis**: In-memory data structure store for caching cart data.
- **JWT**: JSON Web Token for user authentication.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Redis

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/osamanazar47/e_commerce_api.git

Navigate to the project directory:

bash
Copy code
cd e_commerce_api
Install dependencies:

bash
Copy code
npm install
Set up environment variables. Create a .env file in the root directory with the following contents:

makefile
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
Start the server:

bash
Copy code
npm start
Alternatively, for development with automatic restarts:

bash
Copy code
npm run dev
API Endpoints
User Registration
POST /register
Request Body:
json
Copy code
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: JWT token upon successful registration.
User Login
POST /login
Request Body:
json
Copy code
{
  "email": "john@example.com",
  "password": "password123"
}
Response: JWT token upon successful login.
Create Product
POST /products
Request Body:
json
Copy code
{
  "title": "Laptop",
  "description": "A great laptop",
  "price": 1200,
  "stock": 10,
  "category": "Electronics"
}
Response: Product details.
Add Item to Cart
POST /cart
Headers: Authorization: Bearer <token>
Request Body:
json
Copy code
{
  "productId": "product_id",
  "quantity": 1
}
Response: Cart contents.
Place Order
POST /orders
Headers: Authorization: Bearer <token>
Request Body:
json
Copy code
{
  "totalAmount": 1200,
  "products": [
    {
      "productId": "product_id",
      "quantity": 1
    }
  ]
}