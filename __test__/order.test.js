/* eslint-disable jest/prefer-expect-assertions */
/* eslint-disable no-multi-spaces */
/* eslint-disable jest/no-hooks */
/* eslint-disable jest/no-truthy-falsy */
/* eslint-disable jest/lowercase-name */
import supertest from 'supertest';
import mongoose from 'mongoose';
import server, { app } from '../server'; // Import the server instance from your server file
import Order from '../models/order';
import Product from '../models/product';
import User from '../models/user';

jest.setTimeout(10000); // Set timeout for tests

describe('Orders Controller', () => {
  // Hook to run before any test (like connecting to the database, clearing data, etc.)
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  });

  // Hook to run after all tests (like disconnecting from the database)
  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Close the server
  });

  // Test case for creating a new order
  describe('POST /orders', () => {
    let userId;
    let productId;

    beforeAll(async () => {
      // Create a user with a unique email
      const user = new User({ name: 'Test User', email: `test${Date.now()}@example.com`, password: 'password123' });
      const savedUser = await user.save();
      userId = savedUser._id;

      // Create a product
      const product = new Product({
        title: 'Test Product',
        price: 50,
        category: 'Test',
        stock: 10,
      });
      const savedProduct = await product.save();
      productId = savedProduct._id;
    });

    it('should create a new order', async () => {
      const newOrder = {
        userId,
        products: [{ productId, quantity: 2 }],
      };

      const res = await supertest(app)
        .post('/orders')
        .send(newOrder);

      expect(res.status).toBe(201);  // Expecting a 201 status code
      expect(res.body).toHaveProperty('_id');  // The order should have an _id
      expect(res.body.totalAmount).toBe(100);  // The total amount should match
    });

    it('should return 404 if user does not exist', async () => {
      const newOrder = {
        userId: mongoose.Types.ObjectId(), // Non-existent user ID
        products: [{ productId, quantity: 2 }],
      };

      const res = await supertest(app)
        .post('/orders')
        .send(newOrder);

      expect(res.status).toBe(404);  // Expecting a 404 status code
      expect(res.body.message).toBe('User not found');
    });

    it('should return 404 if product does not exist', async () => {
      const newOrder = {
        userId,
        products: [{ productId: mongoose.Types.ObjectId(), quantity: 2 }], // Non-existent product ID
      };

      const res = await supertest(app)
        .post('/orders')
        .send(newOrder);

      expect(res.status).toBe(404);  // Expecting a 404 status code
      expect(res.body.message).toBe('Product with ID ' + newOrder.products[0].productId + ' not found');
    });

    it('should return 400 if insufficient stock', async () => {
      const newOrder = {
        userId,
        products: [{ productId, quantity: 20 }], // Quantity exceeds stock
      };

      const res = await supertest(app)
        .post('/orders')
        .send(newOrder);

      expect(res.status).toBe(400);  // Expecting a 400 status code
      expect(res.body.message).toBe('Insufficient stock for product Test Product');
    });
  });

  // Test case for getting all orders
  describe('GET /orders', () => {
    it('should return a list of orders', async () => {
      const res = await supertest(app)
        .get('/orders');

      expect(res.status).toBe(200);  // Expecting a 200 status code
      expect(Array.isArray(res.body)).toBeTruthy();  // The response should be an array
    });
  });

  // Test case for getting a specific order by ID
  describe('GET /orders/:id', () => {
    let orderId;

    beforeAll(async () => {
      // Create a user with a unique email
      const user = new User({ name: 'Test User', email: `test${Date.now()}@example.com`, password: 'password123' });
      const savedUser = await user.save();
      const userId = savedUser._id;

      // Create a product
      const product = new Product({
        title: 'Test Product',
        price: 50,
        category: 'Test',
        stock: 10,
      });
      const savedProduct = await product.save();
      const productId = savedProduct._id;

      // Create an order
      const order = new Order({
        userId,
        products: [{ productId, quantity: 2 }],
        date: new Date(),
        totalAmount: 100,
      });
      const savedOrder = await order.save();
      orderId = savedOrder._id;
    });

    it('should return an order by ID', async () => {
      const res = await supertest(app)
        .get(`/orders/${orderId}`);

      expect(res.status).toBe(200);  // Expecting a 200 status code
      expect(res.body).toHaveProperty('_id');  // The order should have an _id
      expect(res.body._id).toBe(orderId.toString());  // The ID should match
    });

    it('should return 404 for a non-existent order', async () => {
      const res = await supertest(app)
        .get('/orders/605c72ef56f536001f6471a5'); // Use a non-existent ID

      expect(res.status).toBe(404);  // Expecting a 404 status code
      expect(res.body.message).toBe('Order not found');
    });
  });

  // Test case for updating an order
  describe('PUT /orders/:id', () => {
    let orderId;
    let productId;
    let userId;

    beforeAll(async () => {
      // Create a user with a unique email
      const user = new User({ name: 'Test User', email: `test${Date.now()}@example.com`, password: 'password123' });
      const savedUser = await user.save();
      userId = savedUser._id;

      // Create a product
      const product = new Product({
        title: 'Test Product',
        price: 50,
        category: 'Test',
        stock: 10,
      });
      const savedProduct = await product.save();
      productId = savedProduct._id;

      // Create an order
      const order = new Order({
        userId,
        products: [{ productId, quantity: 2 }],
        date: new Date(),
        totalAmount: 100,
      });
      const savedOrder = await order.save();
      orderId = savedOrder._id;
    });

    it('should update an order', async () => {
      const updateData = {
        products: [{ productId: productId.toString(), quantity: 1 }], // Update with new product
      };

      const res = await supertest(app)
        .put(`/orders/${orderId}`)
        .send(updateData);

      expect(res.status).toBe(200);  // Expecting a 200 status code
      expect(res.body).toHaveProperty('_id');  // The order should have an _id
    });

    it('should return 404 for a non-existent order', async () => {
      const res = await supertest(app)
        .put('/orders/605c72ef56f536001f6471a5') // Use a non-existent ID
        .send({ products: [{ productId: '605c72ef56f536001f6471a5', quantity: 1 }] });

      expect(res.status).toBe(404);  // Expecting a 404 status code
      expect(res.body.message).toBe('Order not found');
    });
  });

  // Test case for deleting an order
  describe('DELETE /orders/:id', () => {
    let orderId;

    beforeAll(async () => {
      // Create a user with a unique email
      const user = new User({ name: 'Test User', email: `test${Date.now()}@example.com`, password: 'password123' });
      const savedUser = await user.save();
      const userId = savedUser._id;

      // Create a product
      const product = new Product({
        title: 'Test Product',
        price: 50,
        category: 'Test',
        stock: 10,
      });
      const savedProduct = await product.save();
      const productId = savedProduct._id;

      // Create an order
      const order = new Order({
        userId,
        products: [{ productId, quantity: 2 }],
        date: new Date(),
        totalAmount: 100,
      });
      const savedOrder = await order.save();
      orderId = savedOrder._id;
    });

    it('should delete an order', async () => {
      const res = await supertest(app)
        .delete(`/orders/${orderId}`);

      expect(res.status).toBe(200);  // Expecting a 200 status code
      expect(res.body.message).toBe('Order deleted successfully');
    });

    it('should return 404 for a non-existent order', async () => {
      const res = await supertest(app)
        .delete('/orders/605c72ef56f536001f6471a5') // Use a non-existent ID
        .send();

      expect(res.status).toBe(404);  // Expecting a 404 status code
      expect(res.body.message).toBe('Order not found');
    });
  });
});
