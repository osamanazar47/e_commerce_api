import redisClient from '../utils/redis'; // Import your Redis client

class CartController {
  // Add an item to the cart
  static async addItemToCart(req, res) {
    try {
      const { userId } = req.user; // Get userId from the request (authenticated user)
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
      }

      // Retrieve current cart from Redis
      const cartKey = `cart:${userId}`;
      const cartData = await redisClient.get(cartKey);
      const cart = cartData ? JSON.parse(cartData) : {};

      // Update the cart
      if (!cart[productId]) {
        cart[productId] = 0;
      }
      cart[productId] += quantity;

      // Save updated cart to Redis
      await redisClient.set(cartKey, JSON.stringify(cart), 3600); // Set TTL to 1 hour

      return res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get the cart for the user
  static async getCart(req, res) {
    try {
      const { userId } = req.user; // Get userId from the request (authenticated user)

      // Retrieve cart from Redis
      const cartKey = `cart:${userId}`;
      const cartData = await redisClient.get(cartKey);
      const cart = cartData ? JSON.parse(cartData) : {};

      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Clear the cart for the user
  static async clearCart(req, res) {
    try {
      const { userId } = req.user; // Get userId from the request (authenticated user)

      // Delete cart from Redis
      const cartKey = `cart:${userId}`;
      await redisClient.del(cartKey);

      return res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default CartController;
