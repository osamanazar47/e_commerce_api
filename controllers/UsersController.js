import bcrypt from 'bcryptjs';
import User from '../models/user';

export default class UsersController {
  static async createUser(req, res) {
    const { name, email, password } = req.body || {};

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).json(user);
  }

  static async findUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async delUser(req, res) {
    try {
      const result = await User.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No data provided for update' });
      }

      // Update the user
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true, // return the updated document
        runValidators: true, // validate before updating
      });

      // Check if the user exists
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the updated user
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
