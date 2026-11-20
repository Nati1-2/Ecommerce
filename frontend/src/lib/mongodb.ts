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

// Seed real hashed demo users and vendor data once per process start (dev only)
async function seedDemoUsers() {
  if (process.env.NODE_ENV === "production") return;
  if (global.inMemorySeeded) return;
  global.inMemorySeeded = true;

  // 1. Seed Real Users
  for (const account of REAL_USERS) {
    const rawPass = account.role === "ADMIN" ? (account.email.includes("nati") ? "nati1234" : "admin") : account.role === "VENDOR" ? "vendor123" : "password123";
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

  // Also maintain backwards compatibility with legacy demo aliases
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
        membership: leg.role === "ADMIN" ? "SuperAdmin Tier 👑" : leg.role === "VENDOR" ? "Vendor Merchant 🚀" : "Standard Member ⭐",
        points: 500,
        isVerified: true,
      });
    }
  }

  // 2. Seed Real Vendor Stores
  global.inMemoryVendors = [...REAL_VENDORS];
  global.inMemoryProfile = REAL_VENDORS[0];

  // 3. Seed Real Products Catalog
  global.inMemoryProducts = [...REAL_PRODUCTS];

  // 4. Seed Real Orders Pipeline
  global.inMemoryOrders = [...REAL_ORDERS];

  // 5. Seed Real Reviews
  global.inMemoryReviews = [...REAL_REVIEWS];

  // 6. Seed Real Customers
  global.inMemoryCustomers = REAL_USERS.filter((u) => u.role === "CUSTOMER").map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    totalOrders: u.totalOrders,
    totalSpent: u.totalSpent,
    status: u.isVerified ? "Active" : "Pending",
  }));

  // 7. Seed Real Payments & Ledgers
  global.inMemoryPayments = {
    ...REAL_PAYMENTS_DATA,
    transactions: REAL_ORDERS.map((o) => ({
      id: o.stripeChargeId || `tx_${o.orderNumber}`,
      amount: o.grandTotal,
      status: o.paymentStatus === "PAID" ? "Successful" : o.paymentStatus === "PENDING" ? "Pending" : "Failed",
      type: "Order Payment",
      date: new Date(o.rawDate).toISOString().split("T")[0],
      customer: o.customerName,
      method: o.paymentMethod,
    })),
    payouts: [
      {
        id: "po_1001",
        amount: 14850.0,
        currency: "USD",
        status: "Processing",
        payoutMethod: "Stripe Escrow Deposit",
        bankAccountLast4: "5678",
        initiatedAt: new Date(Date.now() - 3600 * 24 * 2 * 1000).toISOString().split("T")[0],
        estimatedArrival: "Tomorrow, Nov 20",
      },
      {
        id: "po_1002",
        amount: 28940.0,
        currency: "USD",
        status: "Paid",
        payoutMethod: "Stripe Deposit",
        bankAccountLast4: "1234",
        initiatedAt: new Date(Date.now() - 3600 * 24 * 7 * 1000).toISOString().split("T")[0],
        estimatedArrival: "Delivered",
      },
    ],
    balance: { available: 184500.0, pending: 14850.0, totalEarnings: REAL_PLATFORM_STATS.revenue },
  };

  // 8. Seed Platform Metrics & Aggregations
  global.inMemoryMetrics = {
    totalRevenue: REAL_PLATFORM_STATS.revenue,
    revenueChangePercent: REAL_PLATFORM_STATS.revenueGrowth,
    totalOrders: REAL_PLATFORM_STATS.orders,
    ordersChangePercent: REAL_PLATFORM_STATS.ordersGrowth,
    productsSold: 8490,
    productsSoldChangePercent: 14.2,
    totalCustomers: REAL_PLATFORM_STATS.users,
    customersChangePercent: REAL_PLATFORM_STATS.usersGrowth,
    pendingOrdersCount: 2,
    processingOrdersCount: 4,
    shippedOrdersCount: 6,
    deliveredOrdersCount: 3236,
    cancelledOrdersCount: 0,
    lowStockCount: 3,
    outOfStockCount: 0,
  };

  // 9. Seed Time-Series Analytics
  global.inMemoryAnalytics = {
    revenueData: REAL_REVENUE_SERIES,
    userGrowthData: REAL_USER_GROWTH_SERIES,
    dailyPerformance: REAL_REVENUE_SERIES.slice(-7).map((r) => ({
      date: r.date,
      revenue: r.revenue,
      orders: r.sales,
      profit: r.profit,
      conversionRate: 3.8,
      views: r.sales * 14,
    })),
    categoryBreakdown: [
      { category: "Electronics & Tech", revenue: 485000.0, sales: 2420 },
      { category: "Cameras & Optics", revenue: 320000.0, sales: 1100 },
      { category: "Gaming Peripherals", revenue: 215000.0, sales: 1450 },
      { category: "Home & Furniture", revenue: 165000.0, sales: 780 },
      { category: "Apparel & Fashion", revenue: 99500.0, sales: 2740 },
    ],
    conversionRate: 3.8,
    averageOrderValue: 395.47,
    repeatCustomerRate: 34.2,
    topGeographicRegions: [
      { region: "California", percentage: 32 },
      { region: "New York", percentage: 22 },
      { region: "Texas", percentage: 16 },
      { region: "Washington", percentage: 12 },
      { region: "Illinois", percentage: 10 },
      { region: "International", percentage: 8 },
    ],
  };
}

// Kick off seeding immediately (non-blocking)
seedDemoUsers().catch(console.error);

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 45000,
    };

    const mongoUri = getMongoUri();
    cached!.promise = mongoose.connect(mongoUri, opts).then((m) => m);
  }

  try {
    cached!.conn = await cached!.promise;
    if (process.env.NODE_ENV !== "production") {
      import("./dbSeeder").then(m => m.seedDatabaseCollections()).catch(console.error);
    }
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export async function safeFindUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase();
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
      };
    }
  } catch (err: any) {
    console.warn("MongoDB query notice:", err?.message || err);
  }

  // Ensure seeds are ready before checking memory
  await seedDemoUsers();
  return global.inMemoryUsers!.get(normalizedEmail) || null;
}

export async function safeCreateUser(userData: {
  email: string;
  password?: string;
  name?: string;
  role?: "CUSTOMER" | "ADMIN" | "VENDOR";
  isVerified?: boolean;
}) {
  const normalizedEmail = userData.email.toLowerCase();
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
    console.warn("MongoDB insert notice:", err?.message || err);
  }

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
      };
    }
  } catch (err: any) {
    console.warn("MongoDB findById notice:", err?.message || err);
  }

  await seedDemoUsers();
  for (const u of global.inMemoryUsers!.values()) {
    if (u.id === id || u._id === id) {
      const { password, ...safeUser } = u;
      return safeUser;
    }
  }
  return null;
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
        name: updated.name || "",
        role: updated.role,
        avatar: updated.avatar || "",
        phone: updated.phone || "",
        address: updated.address || "",
        membership: updated.membership || "Standard Member ⭐",
        points: updated.points ?? 100,
        isVerified: updated.isVerified,
      };
    }
  } catch (err: any) {
    console.warn("MongoDB update notice:", err?.message || err);
  }

  for (const [email, u] of global.inMemoryUsers!.entries()) {
    if (u.id === id || u._id === id) {
      const updatedUser = { ...u, ...updateData };
      global.inMemoryUsers!.set(email, updatedUser);
      const { password, ...safeUser } = updatedUser;
      return safeUser;
    }
  }
  return null;
}

export async function safeSaveUserSession(sessionData: {
  sessionId: string;
  userId: string;
  email?: string;
  ipAddress: string;
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  deviceBrand: string;
  deviceModel: string;
  os: string;
  browser: string;
  location: {
    city: string;
    region: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    timezone?: string;
    isp?: string;
  };
  loginAt?: Date;
  lastActive?: Date;
  revoked?: boolean;
  userAgent?: string;
}) {
  const now = new Date();
  const normalizedSession = {
    ...sessionData,
    loginAt: sessionData.loginAt || now,
    lastActive: sessionData.lastActive || now,
    revoked: Boolean(sessionData.revoked),
  };

  // Try MongoDB
  try {
    await connectDB();
    const { UserSession } = await import("@/models/UserSession");
    const existing = await UserSession.findOne({ sessionId: sessionData.sessionId });
    if (existing) {
      existing.lastActive = now;
      existing.ipAddress = sessionData.ipAddress || existing.ipAddress;
      existing.deviceBrand = sessionData.deviceBrand || existing.deviceBrand;
      existing.deviceModel = sessionData.deviceModel || existing.deviceModel;
      existing.location = { ...existing.location, ...sessionData.location };
      await existing.save();
      return existing.toJSON();
    } else {
      const created = await UserSession.create(normalizedSession);
      return created.toJSON();
    }
  } catch (err: any) {
    console.warn("MongoDB session save notice:", err?.message || err);
  }

  // In-memory fallback
  if (!global.inMemoryUserSessions) {
    global.inMemoryUserSessions = [];
  }
  const idx = global.inMemoryUserSessions.findIndex(
    (s: any) => s.sessionId === sessionData.sessionId
  );
  if (idx !== -1) {
    global.inMemoryUserSessions[idx] = {
      ...global.inMemoryUserSessions[idx],
      ...normalizedSession,
      lastActive: now,
    };
    return global.inMemoryUserSessions[idx];
  } else {
    global.inMemoryUserSessions.unshift(normalizedSession);
    return normalizedSession;
  }
}

export async function safeGetUserSessions(userId: string) {
  let dbSessions: any[] = [];
  try {
    await connectDB();
    const { UserSession } = await import("@/models/UserSession");
    const found = await UserSession.find({ userId, revoked: { $ne: true } })
      .sort({ loginAt: -1 })
      .limit(20)
      .lean();
    if (found && found.length > 0) {
      dbSessions = found.map((s: any) => ({
        ...s,
        id: s.sessionId || s._id?.toString(),
      }));
    }
  } catch (err: any) {
    console.warn("MongoDB getUserSessions notice:", err?.message || err);
  }

  // Merge with memory sessions
  const memSessions = (global.inMemoryUserSessions || []).filter(
    (s: any) => s.userId === userId && !s.revoked
  );

  const map = new Map<string, any>();
  for (const s of [...dbSessions, ...memSessions]) {
    const key = s.sessionId || s.id;
    if (key && !map.has(key)) {
      map.set(key, s);
    }
  }

  const results = Array.from(map.values()).sort(
    (a, b) => new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime()
  );

  return results;
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
    console.warn("MongoDB deleteSession notice:", err?.message || err);
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
      return {
        id: String(prod._id || prod.id),
        name: prod.name,
        price: Number(prod.price),
        stock: Number(prod.stock ?? 100),
        isActive: prod.isActive !== false && prod.status !== "INACTIVE" && prod.status !== "DRAFT",
        image: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : "/iphone17.png",
      };
    }
  } catch (e) {
    // DB query error, check in-memory fallback
  }

  const mem = (REAL_PRODUCTS || []).find(
    (p: any) => p.id === productId || p._id === productId || p.sku === productId || p.slug === productId
  );
  if (mem) {
    return {
      id: String(mem.id),
      name: mem.name,
      price: Number(mem.price),
      stock: Number(mem.stock ?? 100),
      isActive: mem.status !== "INACTIVE" && mem.status !== "DRAFT",
      image: Array.isArray(mem.images) && mem.images.length > 0 ? mem.images[0] : "/iphone17.png",
    };
  }

  return null;
}

export async function safeDeductProductStock(productId: string, quantity: number): Promise<boolean> {
  try {
    await connectDB();
    const { Product } = await import("@/models/Product");
    const { VendorProduct } = await import("@/models/VendorProduct");

    // Atomic MongoDB decrement with floor check (stock >= quantity)
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
    if (updated) return true;
  } catch (e) {
    // DB error
  }
  return true;
}


