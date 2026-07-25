import { Category, ICategory } from '../models/Category.js';

export class CategoryService {
  static async getAllCategories() {
    return Category.find().populate('parentCategory').sort({ name: 1 });
  }

  static async getCategoryById(id: string) {
    const category = await Category.findById(id).populate('parentCategory');
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  static async createCategory(data: Partial<ICategory>) {
    const slug = data.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await Category.findOne({ slug });
    if (existing) {
      throw new Error('Category with this name already exists');
    }

    return Category.create({
      ...data,
      slug
    });
  }

  static async updateCategory(id: string, data: Partial<ICategory>) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    Object.assign(category, data);
    await category.save();

    return category;
  }

  static async deleteCategory(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
