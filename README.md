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

2. Navigate to the project directory:

   ```bash
   cd e_commerce_api

3. Install dependencies:
   ```bash
   npm install

4. Set up environment variables.
    Create a .env file in the root directory with the following contents:
   ```makefile
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret

5. Start the server:

   ```bash
   npm run start-server

### API Endpoints

#### User Registration
Endpoint: POST /register
Request Body:
   ```json
   {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
   }
 Response: JWT token upon successful registration.

#### User Login
POST /login
Request Body:
   ```json
   {
    "email": "john@example.com",
    "password": "password123"
   }
Response: JWT token upon successful login.

#### Create Product
POST /products
Request Body:
   ```json
   {
    "title": "Laptop",
    "description": "A great laptop",
    "price": 1200,
    "stock": 10,
    "category": "Electronics"
   }
Response: Product details.

#### Add Item to Cart
POST /cart.
Headers: Authorization: Bearer <token>.
Request Body:
   ```json
   {
    "productId": "product_id",
    "quantity": 1
   }
Response: Cart contents.

#### Place Order
POST /orders.
Headers: Authorization: Bearer <token>.
Request Body:
   ```json
   {
    "totalAmount": 1200,
    "products": [
      {
        "productId": "product_id",
        "quantity": 1
      }
    ]
   }
   