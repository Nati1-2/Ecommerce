import express from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:password123@localhost:27017/product_db?authSource=admin';

// ── Endpoints ──────────────────────────────────────────────────────────────
app.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({ status: 'ACTIVE' })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ status: 'ACTIVE' });

    res.json({
      success: true,
      data: {
        products,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, errors: [{ message: err.message }] });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, errors: [{ message: 'Product not found' }] });
    }
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(400).json({ success: false, errors: [{ message: 'Invalid product ID' }] });
  }
});

const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  basePrice: z.number().positive(),
  vendorId: z.string(),
  categoryId: z.string(),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional(), isPrimary: z.boolean().optional() })).optional(),
  variants: z.array(
    z.object({
      sku: z.string(),
      attributes: z.record(z.string()),
      price: z.number().positive(),
      stockQuantity: z.number().nonnegative()
    })
  ).optional()
});

app.post('/', async (req, res) => {
  try {
    const body = CreateProductSchema.parse(req.body);
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await Product.create({
      ...body,
      slug: `${slug}-${Date.now().toString().slice(-4)}`
    });

    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    res.status(400).json({ success: false, errors: [{ message: err.message }] });
  }
});

// ── Connect & Start Server ─────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('🍃 Product Service connected to MongoDB (product_db)');
    app.listen(PORT, () => console.log(`🚀 Product Service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
