/* eslint-disable no-await-in-loop */
import Order from '../models/order';
import Product from '../models/product';
import User from '../models/user';

export default class OrdersController {
  // Create a new order
  static async createOrder(req, res) {
    try {
      const { userId } = req.user;
      const { products } = req.body;

      // Validate the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Validate the products and calculate total
      let totalAmount = 0;
      const validProducts = [];
      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        if (item.quantity > product.stock) {
          return res.status(400).json({ message: `Insufficient stock for product ${product.title}` });
        }
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
        validProducts.push({ productId: item.productId, quantity: item.quantity });
      }

      // Create a new order
      const newOrder = new Order({
        userId,
        products: validProducts,
        date: new Date(),
        totalAmount,
      });

      await newOrder.save();
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get all orders
  static async getAllOrders(req, res) {
    try {
      // get the userId from the user object
      const { userId } = req.user;

      const orders = await Order.find({ userId }).populate('userId').populate('products.productId');

      // If no orders are found, return an empty array
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get a specific order by ID
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const order = await Order.findOne({ _id: id, userId })
        .populate('userId')
        .populate('products.productId');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Update an order (e.g., add or remove products, change quantity)
  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { products } = req.body;
      const { userId } = req.user;

      const order = await Order.findOne({ _id: id, userId });
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      let totalAmount = 0;
      const validProducts = [];
      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        if (item.quantity > product.stock) {
          return res.status(400).json({ message: `Insufficient stock for product ${product.title}` });
        }
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
        validProducts.push({ productId: item.productId, quantity: item.quantity });
      }

      order.products = validProducts;
      order.totalAmount = totalAmount;
      await order.save();

      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Delete an order
  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const order = await Order.findByIdAndDelete({ _id: id, userId });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
