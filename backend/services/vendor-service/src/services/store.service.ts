import { Store, IStore } from '../models/Store.js';
import { Vendor } from '../models/Vendor.js';

export class StoreService {
  /**
   * Creates a new store for a vendor
   */
  static async createStore(
    vendorId: string,
    data: {
      storeName: string;
      description?: string;
      logo?: string;
      banner?: string;
      address?: string;
    }
  ): Promise<IStore> {
    // 1. Verify vendor exists and is active/approved
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor profile not found. Must register as a vendor first.');
    }

    if (vendor.verificationStatus !== 'APPROVED') {
      throw new Error('Vendor verification is pending or rejected. Cannot create a store.');
    }

    // 2. Check if vendor already has a store
    const existingStore = await Store.findOne({ vendorId });
    if (existingStore) {
      throw new Error('A store already exists for this vendor.');
    }

    // 3. Generate unique slug
    const baseSlug = data.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const store = await Store.create({
      vendorId,
      storeName: data.storeName,
      slug,
      description: data.description,
      logo: data.logo,
      banner: data.banner,
      address: data.address,
      rating: 0,
      totalProducts: 0
    });

    return store;
  }

  /**
   * Retrieves store details by vendor ID
   */
  static async getStoreByVendorId(vendorId: string): Promise<IStore> {
    const store = await Store.findOne({ vendorId });
    if (!store) {
      throw new Error('Store details not found.');
    }
    return store;
  }

  /**
   * Retrieves store details by slug
   */
  static async getStoreBySlug(slug: string): Promise<IStore> {
    const store = await Store.findOne({ slug });
    if (!store) {
      throw new Error('Store not found.');
    }
    return store;
  }

  /**
   * Updates store details
   */
  static async updateStore(
    vendorId: string,
    data: Partial<IStore>
  ): Promise<IStore> {
    const store = await Store.findOne({ vendorId });
    if (!store) {
      throw new Error('Store not found for this vendor.');
    }

    if (data.storeName !== undefined) {
      store.storeName = data.storeName;
      // Re-generate slug if store name changes
      const baseSlug = data.storeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      store.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    if (data.description !== undefined) store.description = data.description;
    if (data.logo !== undefined) store.logo = data.logo;
    if (data.banner !== undefined) store.banner = data.banner;
    if (data.address !== undefined) store.address = data.address;
    if (data.totalProducts !== undefined) store.totalProducts = data.totalProducts;
    if (data.rating !== undefined) store.rating = data.rating;

    await store.save();
    return store;
  }
}
