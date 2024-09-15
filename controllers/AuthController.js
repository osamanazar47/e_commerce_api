import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export default class AuthController {
  // register a new user
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        email,
        password: hashedPassword,
        name,
      });

      await newUser.save();
      // generate the jwt
      const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.TOKEN_SECRET, {
        expiresIn: '1h', // set an expiration date for the token
      });
      return res.status(201).json(token);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Login an existing user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.TOKEN_SECRET, {
        expiresIn: '1h', // Set token expiration
      });

      return res.status(200).json(token);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
}
