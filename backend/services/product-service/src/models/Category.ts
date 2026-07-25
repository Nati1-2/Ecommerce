import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
