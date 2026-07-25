import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import dotenv from 'dotenv';
import { User } from './models/User.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:password123@localhost:27017/auth_db?authSource=admin';
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-2026';

// ── Schemas ────────────────────────────────────────────────────────────────
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['CUSTOMER', 'VENDOR', 'ADMIN']).optional()
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// ── Endpoints ──────────────────────────────────────────────────────────────
app.post('/register', async (req, res) => {
  try {
    const { email, password, role } = RegisterSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, errors: [{ message: 'User already exists' }] });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash,
      role: role || 'CUSTOMER',
      isVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { userId: user._id, email: user.email, role: user.role }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, errors: [{ message: err.message }] });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, errors: [{ message: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, errors: [{ message: 'Invalid credentials' }] });
    }

    const accessToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await user.save();

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: { id: user._id, email: user.email, role: user.role }
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, errors: [{ message: err.message }] });
  }
});

// ── Connect & Start Server ─────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('🍃 Auth Service connected to MongoDB (auth_db)');
    app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
