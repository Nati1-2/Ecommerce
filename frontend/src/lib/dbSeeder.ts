import bcrypt from "bcryptjs";
import {
  REAL_USERS,
  REAL_VENDORS,
  REAL_PRODUCTS,
  REAL_ORDERS,
  REAL_REVIEWS,
} from "./realDataset";

export async function seedDatabaseCollections() {
  try {
    const { User } = await import("@/models/User");
    const { VendorProfile } = await import("@/models/VendorProfile");
    const { VendorProduct } = await import("@/models/VendorProduct");
    const { Order } = await import("@/models/Order");
    const { Review } = await import("@/models/Review");

    const userCount = await User.countDocuments();
    if (userCount >= REAL_USERS.length) return; // already fully seeded

    console.log("🌱 Seeding MongoDB with complete, real production dataset...");

    // 1. Seed Real Users
    for (const u of REAL_USERS) {
      const existing = await User.findOne({ email: u.email.toLowerCase() });
      if (!existing) {
        const rawPass =
          u.role === "ADMIN"
            ? u.email.includes("nati")
              ? "nati1234"
              : "admin"
            : u.role === "VENDOR"
            ? "vendor123"
            : "password123";
        const hashedPassword = await bcrypt.hash(rawPass, 10);
        await User.create({
          _id: u.id,
          email: u.email.toLowerCase(),
          password: hashedPassword,
          name: u.name,
          role: u.role,
          membership: u.membership,
          points: u.points,
          isVerified: u.isVerified,
          avatar: u.avatar,
          phone: u.phone,
          address: u.address,
        });
      }
    }

    // 2. Seed Real Vendor Stores
    for (const v of REAL_VENDORS) {
      const existingStore = await VendorProfile.findOne({ userId: v.userId });
      if (!existingStore) {
        await VendorProfile.create({
          userId: v.userId,
          storeName: v.storeName,
          slug: v.slug,
          logo: v.logo,
          banner: v.banner,
          description: v.description,
          rating: v.rating,
          totalReviews: v.totalReviews,
          verified: v.verified,
          productCount: v.productCount,
          joinedDate: v.joinedDate,
          email: v.email,
          phone: v.phone,
          address: v.address,
        });
      }
    }

    // 3. Seed Real Products
    for (const p of REAL_PRODUCTS) {
      const existingProd = await VendorProduct.findOne({ sku: p.sku });
      if (!existingProd) {
        await VendorProduct.create({
          _id: p.id,
          vendorId: p.vendorId,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          brand: p.brand,
          category: p.category,
          description: p.description,
          price: p.price,
          discountPrice: p.discountPrice,
          currency: p.currency,
          taxRate: p.taxRate,
          stock: p.stock,
          warehouseLocation: p.warehouseLocation,
          lowStockThreshold: p.lowStockThreshold,
          status: p.status,
          images: p.images,
          salesCount: p.salesCount,
          revenueGenerated: p.revenueGenerated,
        });
      }
    }

    // 4. Seed Real Orders
    for (const o of REAL_ORDERS) {
      const existingOrder = await Order.findOne({ orderId: o.orderId });
      if (!existingOrder) {
        await Order.create({
          _id: o.id,
          orderId: o.orderId,
          userId: o.userId,
          items: o.products.map((p) => ({
            productId: p.productId,
            name: p.name,
            image: p.image,
            quantity: p.quantity,
            price: p.price,
          })),
          totalAmount: o.totalAmount,
          grandTotal: o.grandTotal,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          shippingAddress: {
            street: o.shippingAddress.split(",")[0] || "742 Evergreen Terrace",
            city: o.shippingAddress.split(",")[1]?.trim() || "Springfield",
            state: "IL",
            zipCode: "62704",
            country: "US",
          },
          trackingNumber: o.trackingNumber,
          createdAt: o.rawDate,
        });
      }
    }

    // 5. Seed Real Reviews
    for (const r of REAL_REVIEWS) {
      const existingReview = await Review.findOne({ productId: r.productId, customerName: r.customerName });
      if (!existingReview) {
        await Review.create({
          _id: r.id,
          productId: r.productId,
          productName: r.productName,
          productImage: r.productImage,
          customerName: r.customerName,
          rating: r.rating,
          comment: r.comment,
          reply: r.reply ? { text: r.reply, repliedAt: r.createdAt } : undefined,
          status: r.status,
          vendorId: r.vendorId,
        });
      }
    }

    console.log("🌱 Database seeding with real datasets completed successfully!");
  } catch (err) {
    console.error("❌ Failed to seed database collections:", err);
  }
}
