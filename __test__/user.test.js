import mongoose from 'mongoose';
import supertest from 'supertest';
import server, { app } from '../server';
import User from '../models/user';

jest.setTimeout(10000); // Set timeout for tests

beforeAll(async () => {
  // Connect to MongoDB before running tests
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
});

afterAll(async () => {
  // Close MongoDB connection and server after tests
  await mongoose.connection.close();
  await server.close(); // Close the Express app
});

beforeEach(async () => {
  // Clear the database before each test
  await mongoose.connection.db.dropDatabase();
});

describe('User Model and Controlle Tests', () => {

  // Tests for the createUser route
  it('should create a new user', async () => {
    const res = await supertest(app)
      .post('/users')
      .send({
        name: 'Osama Nazar',
        email: 'osama123@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'Osama Nazar');
    expect(res.body).toHaveProperty('email', 'osama123@example.com');
  });

  it('should find user by id', async () => {
    const user = await User.create({
      name: 'Osama Nazar',
      email: 'osama1@example.com',
      password: 'password123',
    });
    const res = await supertest(app).get(`/users/${user._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', user._id.toString());
    expect(res.body).toHaveProperty('name', 'Osama Nazar');
  })

  // Test the updateUser route
  it('should update a user by ID', async () => {
    const user = await User.create({ name: 'Osama Nazar', email: 'osama11@example.com', password: 'password123' });
    const res = await supertest(app)
      .put(`/users/${user._id}`)
      .send({
        name: 'Jane Smith',
        email: 'jane.smith@example.com'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Jane Smith');
    expect(res.body).toHaveProperty('email', 'jane.smith@example.com');
  });

  // For testing the delUser route
  it('should delete a user by ID', async () => {
    const user = await User.create({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
    const res = await supertest(app).delete(`/users/${user._id}`);

    expect(res.status).toBe(204);

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });
});
