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
    await server.close(); // Close the server
  });

  beforeEach(async () => {
    // Clear the database before each test
    await mongoose.connection.db.dropDatabase();
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
      expect(res.body.title).toBe(newProduct.title);  // The name should match
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
});
