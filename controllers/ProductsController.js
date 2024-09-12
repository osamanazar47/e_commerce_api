/* eslint-disable radix */
import Product from '../models/product'; // The path to my Product model

export default class ProductsController {
  // Create a new product
  static async addProduct(req, res) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get a product by ID
  static async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get all products with optional sorting and limiting
  static async getProducts(req, res) {
    try {
      const { sortBy, limit } = req.query;
      const sortOption = sortBy ? { [sortBy]: 1 } : {}; // Default sorting by ascending order
      // eslint-disable-next-line radix
      const limitOption = limit ? parseInt(limit) : 0; // Default is no limit

      const products = await Product.find().sort(sortOption).limit(limitOption);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get products by category with optional sorting and limiting
  static async getProductsByCategory(req, res) {
    try {
      const { sortBy, limit } = req.query;
      const sortOption = sortBy ? { [sortBy]: 1 } : {}; // Default sorting by ascending order
      const limitOption = limit ? parseInt(limit) : 0; // Default is no limit

      const products = await Product.find({ category: req.params.category })
        .sort(sortOption)
        .limit(limitOption);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get distinct categories of products
  static async getCategories(req, res) {
    try {
      const categories = await Product.distinct('category');
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Update a product by ID
  static async updateProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Delete a product by ID
  static async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(204).json({ message: 'Product deleted successfully' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}
