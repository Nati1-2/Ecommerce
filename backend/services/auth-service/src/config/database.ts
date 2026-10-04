import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

import { User } from '../models/User.js';
import { PasswordUtils } from '../utils/password.js';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('🍃 Auth Service MongoDB connected successfully (auth_db)');

    // Ensure demo accounts exist in database
    const demoAccounts = [
      {
        email: 'john.smith@gmail.com',
        plainPassword: 'password123',
        name: 'John Smith',
        role: 'CUSTOMER' as const,
      },
      {
        email: 'vendor@natistore.com',
        plainPassword: 'vendor123',
        name: 'Apex Tech Wearables Store',
        role: 'VENDOR' as const,
      },
      {
        email: 'nati@admin.com',
        plainPassword: 'nati1234',
        name: 'Nati Demo Admin',
        role: 'ADMIN' as const,
      },
    ];

    for (const demo of demoAccounts) {
      const existing = await User.findOne({ email: demo.email });
      if (!existing) {
        const hashedPassword = await PasswordUtils.hashPassword(demo.plainPassword);
        await User.create({
          name: demo.name,
          email: demo.email,
          password: hashedPassword,
          role: demo.role,
          isEmailVerified: true,
          status: 'ACTIVE'
        });
        logger.info(`🌱 Seeded demo user: ${demo.email} (${demo.role})`);
      }
    }
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
