import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  REAL_USERS,
  REAL_VENDORS,
  REAL_PRODUCTS,
  REAL_ORDERS,
  REAL_REVIEWS,
  REAL_PLATFORM_STATS,
  REAL_PAYMENTS_DATA,
  REAL_MARKETPLACE_HEALTH,
  REAL_REVENUE_SERIES,
  REAL_USER_GROWTH_SERIES,
} from "./realDataset";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL: MONGODB_URI environment variable is not configured in production.");
    }
    return "mongodb://127.0.0.1:27017/ecom?authSource=admin";
  }
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
  var inMemoryUsers: Map<string, any> | undefined;
  var inMemoryProducts: any[] | undefined;
  var inMemoryOrders: any[] | undefined;
  var inMemoryReviews: any[] | undefined;
  var inMemoryCustomers: any[] | undefined;
  var inMemoryPayments: any | undefined;
  var inMemoryProfile: any | undefined;
  var inMemoryVendors: any[] | undefined;
  var inMemoryMetrics: any | undefined;
  var inMemoryAnalytics: any | undefined;
  var inMemoryUserSessions: any[] | undefined;
  var inMemoryVisitorLogs: any[] | undefined;
  var inMemorySeeded: boolean | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

if (!global.inMemoryUsers) {
  global.inMemoryUsers = new Map();
}

if (!global.inMemoryUserSessions) {
  global.inMemoryUserSessions = [];
}

if (!global.inMemoryVisitorLogs) {
  global.inMemoryVisitorLogs = [];
}

// Seed real hashed demo users and vendor data once per process start (strictly dev/test only)
async function seedDemoUsers() {
  if (process.env.NODE_ENV === "production") return;
  if (global.inMemorySeeded) return;
  global.inMemorySeeded = true;

  // Seed Real Users in dev
  for (const account of REAL_USERS) {
    const rawPass = account.role === "VENDOR" ? "vendor123" : "password123";
    const hashedPassword = await bcrypt.hash(rawPass, 10);
    global.inMemoryUsers!.set(account.email.toLowerCase(), {
      id: account.id,
      _id: account.id,
      email: account.email.toLowerCase(),
      password: hashedPassword,
      name: account.name,
      role: account.role,
      membership: account.membership,
      points: account.points,
      isVerified: account.isVerified,
      avatar: account.avatar,
      phone: account.phone,
      address: account.address,
      totalOrders: account.totalOrders,
      totalSpent: account.totalSpent,
      createdAt: account.createdAt,
    });
  }

  const legacyAliases = [
    { email: "john.smith@gmail.com", pass: "password123", name: "John Smith", role: "CUSTOMER" },
    { email: "vendor@natistore.com", pass: "vendor123", name: "Apex Tech Wearables Store", role: "VENDOR" },
  ];
  for (const leg of legacyAliases) {
    if (!global.inMemoryUsers!.has(leg.email)) {
      const hPass = await bcrypt.hash(leg.pass, 10);
      global.inMemoryUsers!.set(leg.email, {
        id: "usr-" + leg.role.toLowerCase(),
        _id: "usr-" + leg.role.toLowerCase(),
        email: leg.email,
        password: hPass,
        name: leg.name,
        role: leg.role,
        membership: leg.role === "VENDOR" ? "Vendor Merchant 🚀" : "Standard Member ⭐",
        points: 500,
        isVerified: true,
      });
    }
  }
}

// Kick off seeding in development only
if (process.env.NODE_ENV !== "production") {
  seedDemoUsers().catch(() => null);
}

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const mongoUri = getMongoUri();
    cached!.promise = mongoose.connect(mongoUri, opts).then((m) => m);
  }

  try {
    cached!.conn = await cached!.promise;
    if (process.env.NODE_ENV !== "production") {
      import("./dbSeeder").then(m => m.seedDatabaseCollections()).catch(() => null);
    }
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export async function safeFindUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  try {
    await connectDB();
    const { User } = await import("@/models/User");
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return {
        id: user._id.toString(),
        _id: user._id.toString(),
        email: user.email,
        password: user.password,
        name: user.name || "",
        role: user.role,
        avatar: user.avatar || "",
        phone: user.phone || "",
        address: user.address || "",
        membership: user.membership || "Standard Member ⭐",
        points: user.points ?? 100,
        isVerified: user.isVerified,
        status: (user as any).status || "ACTIVE",
      };
    }
    return null;
  } catch (err: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Database failure during user lookup: ${err.message}`);
    }
    console.warn("MongoDB query notice in development:", err?.message || err);
    await seedDemoUsers();
    return global.inMemoryUsers!.get(normalizedEmail) || null;
  }
}

export async function safeCreateUser(userData: {
  email: string;
  password?: string;
  name?: string;
  role?: "CUSTOMER" | "ADMIN" | "VENDOR";
  isVerified?: boolean;
}) {
  const normalizedEmail = userData.email.toLowerCase().trim();
  try {
    await connectDB();
    const { User } = await import("@/models/User");
    const newUser = await User.create({
      ...userData,
      email: normalizedEmail,
    });
    return {
      id: newUser._id.toString(),
      _id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name || "",
      role: newUser.role,
      avatar: newUser.avatar || "",
      phone: newUser.phone || "",
      address: newUser.address || "",
      membership: newUser.membership || "Standard Member ⭐",
      points: newUser.points ?? 100,
      isVerified: newUser.isVerified,
    };
  } catch (err: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Database failure during user registration: ${err.message}`);
    }
    console.warn("MongoDB insert notice in development:", err?.message || err);
    const id = "usr-" + Math.random().toString(36).substring(2, 9);
    const memoryUser = {
      id,
      _id: id,
      email: normalizedEmail,
      password: userData.password,
      name: userData.name || "",
      role: userData.role || "CUSTOMER",
      isVerified: userData.isVerified ?? true,
      avatar: "",
      phone: "",
      address: "",
      membership: "Standard Member ⭐",
      points: 100,
    };
    global.inMemoryUsers!.set(normalizedEmail, memoryUser);
    return memoryUser;
  }
}

export async function safeFindUserById(id: string) {
  try {
    await connectDB();
    const { User } = await import("@/models/User");
    const user = await User.findById(id).select("-password");
    if (user) {
      return {
        id: user._id.toString(),
        _id: user._id.toString(),
        email: user.email,
        name: user.name || "",
        role: user.role,
        avatar: user.avatar || "",
        phone: user.phone || "",
        address: user.address || "",
        membership: user.membership || "Standard Member ⭐",
        points: user.points ?? 100,
        isVerified: user.isVerified,
        stripeCustomerId: user.stripeCustomerId,
      };
    }
    return null;
  } catch (err: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Database failure during user lookup by ID: ${err.message}`);
    }
    console.warn("MongoDB findById notice in development:", err?.message || err);
    await seedDemoUsers();
    for (const u of global.inMemoryUsers!.values()) {
      if (u.id === id || u._id === id) return u;
    }
    return null;
  }
}

export async function safeUpdateUser(id: string, updateData: Record<string, any>) {
  try {
    await connectDB();
    const { User } = await import("@/models/User");
    const updated = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select("-password");
    if (updated) {
      return {
        id: updated._id.toString(),
        _id: updated._id.toString(),
        email: updated.email,
        name: updated.name,
        role: updated.role,
        avatar: updated.avatar,
        phone: updated.phone,
        address: updated.address,
        membership: updated.membership,
        points: updated.points,
        isVerified: updated.isVerified,
      };
    }
  } catch (err: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Database failure updating user: ${err.message}`);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    for (const [email, u] of global.inMemoryUsers!.entries()) {
      if (u.id === id || u._id === id) {
        const merged = { ...u, ...updateData };
        global.inMemoryUsers!.set(email, merged);
        return merged;
      }
    }
  }

  return null;
}

export async function safeSaveUserSession(sessionData: {
  sessionId: string;
  userId: string;
  email: string;
  ipAddress: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  os: string;
  browser: string;
  location: any;
  userAgent: string;
  loginAt?: Date;
  lastActive?: Date;
}) {
  try {
    await connectDB();
    const { UserSession } = await import("@/models/UserSession");
    await UserSession.create({
      loginAt: sessionData.loginAt || new Date(),
      lastActive: sessionData.lastActive || new Date(),
      revoked: false,
      ...sessionData,
    });
    return true;
  } catch (err: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Unable to persist login session");
    }
  }

  const memSession = {
    ...sessionData,
    loginAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    revoked: false,
  };
  global.inMemoryUserSessions!.unshift(memSession);
  if (global.inMemoryUserSessions!.length > 100) {
    global.inMemoryUserSessions = global.inMemoryUserSessions!.slice(0, 100);
  }
  return true;
}

export async function safeGetUserSessions(userId: string) {
  try {
    await connectDB();
    const { UserSession } = await import("@/models/UserSession");
    const sessions = await UserSession.find({ userId, revoked: false })
      .sort({ loginAt: -1 })
      .limit(10);
    if (sessions && sessions.length > 0) {
      return sessions.map((s) => ({
        sessionId: s.sessionId,
        ipAddress: s.ipAddress,
        deviceType: s.deviceType,
        deviceBrand: s.deviceBrand,
        deviceModel: s.deviceModel,
        os: s.os,
        browser: s.browser,
        location: s.location,
        loginAt: s.loginAt,
      }));
    }
  } catch (err: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Database failure retrieving sessions: ${err.message}`);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    return (global.inMemoryUserSessions || []).filter((s: any) => s.userId === userId && !s.revoked);
  }

  return [];
}

export async function safeDeleteUserSession(userId: string, sessionId: string) {
  try {
    await connectDB();
    const { UserSession } = await import("@/models/UserSession");
    await UserSession.updateOne(
      { sessionId, userId },
      { $set: { revoked: true } }
    );
  } catch (err: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Database failure revoking session: ${err.message}`);
    }
  }

  if (global.inMemoryUserSessions) {
    const idx = global.inMemoryUserSessions.findIndex(
      (s: any) => s.sessionId === sessionId && s.userId === userId
    );
    if (idx !== -1) {
      global.inMemoryUserSessions[idx].revoked = true;
    }
  }
  return true;
}

export async function safeFindProductById(productId: string) {
  if (!productId || typeof productId !== "string") {
    return null;
  }

  try {
    await connectDB();
    const { Product } = await import("@/models/Product");
    const { VendorProduct } = await import("@/models/VendorProduct");

    let prod = null;
    if (mongoose.isValidObjectId(productId)) {
      prod = await Product.findById(productId);
    }
    if (!prod) {
      prod = await Product.findOne({ $or: [{ sku: productId }, { slug: productId }] });
    }
    if (!prod && mongoose.isValidObjectId(productId)) {
      prod = await VendorProduct.findById(productId);
    }
    if (!prod) {
      prod = await VendorProduct.findOne({ $or: [{ sku: productId }, { slug: productId }] });
    }
    if (prod) {
      const anyProd = prod as any;
      const isActive = anyProd.isActive !== undefined
        ? anyProd.isActive !== false
        : anyProd.status === "Active" || anyProd.status === "Approved";
      return {
        id: String(prod._id || prod.id),
        name: prod.name,
        price: Number(prod.price),
        stock: Number(prod.stock ?? 0),
        isActive,
        image: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : "/iphone17.png",
      };
    }
    return null;
  } catch (e: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Database error looking up product '${productId}': ${e.message}`);
    }
    const mem = (REAL_PRODUCTS || []).find(
      (p: any) => p.id === productId || p._id === productId || p.sku === productId || p.slug === productId
    );
    if (mem) {
      return {
        id: String(mem.id),
        name: mem.name,
        price: Number(mem.price),
        stock: Number(mem.stock ?? 0),
        isActive: mem.status === "Approved",
        image: Array.isArray(mem.images) && mem.images.length > 0 ? mem.images[0] : "/iphone17.png",
      };
    }
    return null;
  }
}

/**
 * Atomically deducts inventory using strict MongoDB conditional updates (`stock >= quantity`).
 * Guaranteed to return true ONLY when deduction succeeds.
 * Throws or returns false on insufficient stock, invalid quantities, or DB failure.
 */
export async function safeDeductProductStock(productId: string, quantity: number): Promise<boolean> {
  // Validate quantity
  if (typeof quantity !== "number" || isNaN(quantity) || !Number.isInteger(quantity) || quantity <= 0) {
    throw new Error(`Invalid stock deduction quantity: ${quantity}. Whole positive integers required.`);
  }

  if (!productId || typeof productId !== "string") {
    throw new Error("Invalid product ID provided for stock deduction.");
  }

  try {
    await connectDB();
    const { Product } = await import("@/models/Product");
    const { VendorProduct } = await import("@/models/VendorProduct");

    let updated = null;
    if (mongoose.isValidObjectId(productId)) {
      updated = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
    }
    if (!updated) {
      updated = await Product.findOneAndUpdate(
        { $or: [{ sku: productId }, { slug: productId }], stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
    }
    if (!updated && mongoose.isValidObjectId(productId)) {
      updated = await VendorProduct.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
    }
    if (!updated) {
      updated = await VendorProduct.findOneAndUpdate(
        { $or: [{ sku: productId }, { slug: productId }], stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
    }

    if (updated) {
      return true;
    }

    // If update returned null, stock was insufficient or product did not exist
    return false;
  } catch (e: any) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Database error during stock deduction for '${productId}': ${e.message}`);
    }
    const mem = (REAL_PRODUCTS || []).find((p: any) => p.id === productId || p._id === productId || p.sku === productId);
    if (mem && (mem.stock ?? 100) >= quantity) {
      mem.stock = (mem.stock ?? 100) - quantity;
      return true;
    }
    return false;
  }
}

/**
 * Restores product stock atomically during compensation/rollback when order creation fails.
 */
export async function safeRestoreProductStock(productId: string, quantity: number): Promise<boolean> {
  if (typeof quantity !== "number" || isNaN(quantity) || quantity <= 0) return false;
  try {
    await connectDB();
    const { Product } = await import("@/models/Product");
    const { VendorProduct } = await import("@/models/VendorProduct");

    let updated = null;
    if (mongoose.isValidObjectId(productId)) {
      updated = await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } }, { new: true });
    }
    if (!updated) {
      updated = await Product.findOneAndUpdate(
        { $or: [{ sku: productId }, { slug: productId }] },
        { $inc: { stock: quantity } },
        { new: true }
      );
    }
    if (!updated && mongoose.isValidObjectId(productId)) {
      updated = await VendorProduct.findByIdAndUpdate(productId, { $inc: { stock: quantity } }, { new: true });
    }
    if (!updated) {
      updated = await VendorProduct.findOneAndUpdate(
        { $or: [{ sku: productId }, { slug: productId }] },
        { $inc: { stock: quantity } },
        { new: true }
      );
    }
    return Boolean(updated);
  } catch (err) {
    console.error(`Failed to restore product stock for ${productId}:`, err);
    return false;
  }
}
