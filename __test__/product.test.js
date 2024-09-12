/* eslint-disable jest/prefer-expect-assertions */
/* eslint-disable no-multi-spaces */
/* eslint-disable jest/no-hooks */
/* eslint-disable jest/no-truthy-falsy */
/* eslint-disable jest/lowercase-name */
import supertest from 'supertest';
import mongoose from 'mongoose';
import server, { app } from '../server'; // Import the server instance from your server file
import Product from '../models/product';

jest.setTimeout(10000); // Set timeout for tests

describe('Product Controller', () => {
  // Hook to run before any test (like connecting to the database, clearing data, etc.)
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Hook to run after all tests (like disconnecting from the database)
  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Close the server
  });

  // Test case for creating a new product
  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'Sample Product',
        price: 100,
        category: 'Electronics',
        stock: 50,
      };

      const res = await supertest(app)
        .post('/products')
        .send(newProduct);

      expect(res.status).toBe(201);  // Expecting a 201 status code
      expect(res.body).toHaveProperty('_id');  // The product should have an _id
      expect(res.body.title).toBe(newProduct.title);  // The title should match
    });
  });

  // Test case for getting a list of products with sorting and limiting
  describe('GET /products', () => {
    it('should return a list of products with sorting and limiting', async () => {
      const res = await supertest(app)
        .get('/products')
        .query({ sortBy: 'price', limit: 2 });

      expect(res.status).toBe(200);  // Expecting a 200 status code
      expect(Array.isArray(res.body)).toBeTruthy();  // The response should be an array
      expect(res.body.length).toBeLessThanOrEqual(2);  // Should return at most 2 products
    });
  });

  // Test case for getting a product by ID
  describe('GET /products/:id', () => {
    let productId;

    beforeAll(async () => {
      const newProduct = new Product({
        title: 'Sample Product for Get',
        price: 50,
        category: 'Test',
        stock: 10,
      });
      const savedProduct = await newProduct.save();
      productId = savedProduct._id;
    });

    it('should return a product by ID', async () => {
      const res = await supertest(app)
        .get(`/products/${productId}`);

      expect(res.status).toBe(200);  // Expecting a 200 status code
      expect(res.body).toHaveProperty('_id');  // The product should have an _id
      expect(res.body._id).toBe(productId.toString());  // The ID should match
    });

    it('should return 404 for a non-existent product', async () => {
      const res = await supertest(app)
        .get('/products/605c72ef56f536001f6471a5'); // Use a non-existent ID

      expect(res.status).toBe(404);  // Expecting a 404 status code
      expect(res.body.message).toBe('Product not found');
    });
  });

  // Test case for updating a product by ID
  describe('PUT /products/:id', () => {
    let productId;

    beforeAll(async () => {
      const newProduct = new Product({
        title: 'Sample Product for Update',
        price: 75,
        category: 'Test',
        stock: 20,
      });
      const savedProduct = await newProduct.save();
      productId = savedProduct._id;
    });

    it('should update a product by ID', async () => {
      const updateData = { price: 80 };

      const res = await supertest(app)
        .put(`/products/${productId}`)
        .send(updateData);

      expect(res.status).toBe(200);  // Expecting a 200 status code
      expect(res.body).toHaveProperty('_id');  // The product should have an _id
      expect(res.body.price).toBe(updateData.price);  // The price should match
    });

    it('should return 404 for a non-existent product', async () => {
      const res = await supertest(app)
        .put('/products/605c72ef56f536001f6471a5') // Use a non-existent ID
        .send({ price: 100 });

      expect(res.status).toBe(404);  // Expecting a 404 status code
      expect(res.body.message).toBe('Product not found');
    });
  });

  // Test case for deleting a product by ID
  describe('DELETE /products/:id', () => {
    let productId;

    beforeAll(async () => {
      const newProduct = new Product({
        title: 'Sample Product for Delete',
        price: 90,
        category: 'Test',
        stock: 5,
      });
      const savedProduct = await newProduct.save();
      productId = savedProduct._id;
    });

    it('should delete a product by ID', async () => {
      const res = await supertest(app)
        .delete(`/products/${productId}`);

      expect(res.status).toBe(204);  // Expecting a 204 status code
      expect(res.body).toStrictEqual({}); // Body should be empty
    });

    it('should return 404 for a non-existent product', async () => {
      const res = await supertest(app)
        .delete('/products/605c72ef56f536001f6471a5'); // Use a non-existent ID

      expect(res.status).toBe(404);  // Expecting a 404 status code
      expect(res.body.message).toBe('Product not found');
    });
  });

  // Test case for getting products by category
  describe('GET /products/category/:category', () => {
    it('should return products by category with sorting and limiting', async () => {
      const res = await supertest(app)
        .get('/products/category/Electronics')
        .query({ sortBy: 'price', limit: 2 });

      expect(res.status).toBe(200);  // Expecting a 200 status code
      expect(Array.isArray(res.body)).toBeTruthy();  // The response should be an array
      expect(res.body.length).toBeLessThanOrEqual(2);  // Should return at most 2 products
    });
  });
});
