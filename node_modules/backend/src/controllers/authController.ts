import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';
import { ApiResponse } from '../utils/response';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json(ApiResponse.error('User already exists'));
      }

      const hashedPassword = await hashPassword(password);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      await user.save();
      const token = generateToken(user._id.toString(), email, user.role);

      const { password: _, ...userWithoutPassword } = user.toObject();

      return res.status(201).json(
        ApiResponse.success(
          {
            user: userWithoutPassword,
            token,
          },
          'User registered successfully'
        )
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Registration failed', error));
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json(ApiResponse.error('User not found'));
      }

      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json(ApiResponse.error('Invalid password'));
      }

      const token = generateToken(user._id.toString(), email, user.role);
      const { password: _, ...userWithoutPassword } = user.toObject();

      return res.json(
        ApiResponse.success(
          {
            user: userWithoutPassword,
            token,
          },
          'Login successful'
        )
      );
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Login failed', error));
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      const user = await User.findById((req as any).user.userId);
      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      const { password: _, ...userWithoutPassword } = user.toObject();
      return res.json(ApiResponse.success(userWithoutPassword));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to fetch profile', error));
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, bio, avatar } = req.body;
      const user = await User.findByIdAndUpdate(
        (req as any).user.userId,
        { firstName, lastName, bio, avatar },
        { new: true }
      );

      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found'));
      }

      const { password: _, ...userWithoutPassword } = user.toObject();
      return res.json(ApiResponse.success(userWithoutPassword, 'Profile updated'));
    } catch (error: any) {
      return res.status(500).json(ApiResponse.error('Failed to update profile', error));
    }
  },
};
