import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { generateToken } from '../utils/jwt';

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthService {
  private static validateFullName(fullName: string): void {
    // Remove extra spaces and trim
    const cleanName = fullName.replace(/\s+/g, ' ').trim();

    // Check minimum length (at least 2 words, each word minimum 2 characters)
    const words = cleanName.split(' ');
    if (words.length < 2) {
      throw new ValidationError('Please enter your full name (first and last name)');
    }

    // Check each word length and format
    for (const word of words) {
      if (word.length < 2) {
        throw new ValidationError('Each part of your name must be at least 2 characters long');
      }

      // Allow letters, dots (for initials), and hyphens
      if (!/^[A-Za-z.-]+$/.test(word)) {
        throw new ValidationError('Name can only contain letters, dots, and hyphens');
      }
    }

    // Check total length
    if (cleanName.length > 50) {
      throw new ValidationError('Full name is too long (maximum 50 characters)');
    }
  }

  static async register(fullName: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      // Validate and clean the full name
      const cleanName = fullName.replace(/\s+/g, ' ').trim();
      this.validateFullName(cleanName);

      // Check for existing user (case insensitive)
      const existingUser = await User.findOne({
        fullName: { $regex: new RegExp(`^${cleanName}$`, 'i') }
      });

      if (existingUser) {
        throw new ValidationError('This name is already registered. Please use a different name or add your initials to differentiate.');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      
      // Make the first user an admin
      const isFirstUser = await User.countDocuments() === 0;
      
      const user = await User.create({
        fullName: cleanName, // Store the cleaned name
        passwordHash,
        role: isFirstUser ? 'admin' : 'user',
      });

      const token = generateToken(user);
      return { user, token };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  static async login(fullName: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      // Clean the full name for comparison
      const cleanName = fullName.replace(/\s+/g, ' ').trim();
      
      // Case insensitive search
      const user = await User.findOne({
        fullName: { $regex: new RegExp(`^${cleanName}$`, 'i') }
      });

      if (!user) {
        throw new Error('User not found. Please check your name or register if you\'re new.');
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Incorrect password. Please try again.');
      }

      const token = generateToken(user);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async getUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User account not found. Please log in again.');
    }
    return user;
  }
}