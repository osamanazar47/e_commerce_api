import express from 'express';
import UsersController from '../controllers/UsersController';
import ProductsController from '../controllers/ProductsController';

const router = express.Router();

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
router.post('/orders', OrdersController.addOrder);
router.get('/orders', OrdersController.getOrders);
router.get('/orders/:id', OrdersController.getOrderById);
router.get('/users/:userId/orders', OrdersController.getUserOrders);
router.put('/orders/:id', OrdersController.updateOrder);
router.delete('/orders/:id', OrdersController.deleteOrder);
export default router;
