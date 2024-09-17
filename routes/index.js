import express from 'express';
import UsersController from '../controllers/UsersController';
import ProductsController from '../controllers/ProductsController';
import OrdersController from '../controllers/OrdersController';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middlewares/authMiddleware';
import CartController from '../controllers/CartsController';

const router = express.Router();

// Authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// User routes
router.post('/users', UsersController.createUser);
router.get('/users/:id', UsersController.findUserById);
router.delete('/users/:id', UsersController.delUser);
router.put('/users/:id', UsersController.updateUser);

// Product routes
router.post('/products', ProductsController.addProduct);
router.get('/products/:id', ProductsController.getProduct);
router.get('/products', ProductsController.getProducts); // For getting all products with optional sorting and limiting
router.get('/products/category/:category', ProductsController.getProductsByCategory); // For getting products by category
router.get('/products/categories', ProductsController.getCategories); // For getting distinct product categories
router.put('/products/:id', ProductsController.updateProduct);
router.delete('/products/:id', ProductsController.deleteProduct);

// Order routes
router.post('/orders', authMiddleware, OrdersController.createOrder);
router.get('/orders', authMiddleware, OrdersController.getAllOrders);
router.get('/orders/:id', authMiddleware, OrdersController.getOrderById);
router.put('/orders/:id', authMiddleware, OrdersController.updateOrder);
router.delete('/orders/:id', authMiddleware, OrdersController.deleteOrder);

// Cart routes
router.post('/cart', authMiddleware, CartController.addItemToCart);
router.get('/cart/:id', authMiddleware, CartController.getCart);
router.delete('/cart/:id', authMiddleware, CartController.clearCart);
export default router;
