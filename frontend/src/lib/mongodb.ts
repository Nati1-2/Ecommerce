import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecom?authSource=admin" || "mongodb://root:rootpassword@localhost:27017/ecom?authSource=admin";

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
  var inMemoryMetrics: any | undefined;
  var inMemoryAnalytics: any | undefined;
  var inMemorySeeded: boolean | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

if (!global.inMemoryUsers) {
  global.inMemoryUsers = new Map();
}

// Seed real hashed demo users and vendor data once per process start
async function seedDemoUsers() {
  if (global.inMemorySeeded) return;
  global.inMemorySeeded = true;

  const demoAccounts = [
    {
      email: "john.smith@gmail.com",
      plainPassword: "password123",
      name: "John Smith",
      role: "CUSTOMER" as const,
      id: "usr-demo-customer",
      membership: "Standard Member ⭐",
      points: 120,
    },
    {
      email: "vendor@natistore.com",
      plainPassword: "vendor123",
      name: "Apex Tech Wearables Store",
      role: "VENDOR" as const,
      id: "usr-demo-vendor",
      membership: "Vendor Merchant 🚀",
      points: 450,
    },
    {
      email: "nati@admin.com",
      plainPassword: "nati1234",
      name: "Nati Demo Admin",
      role: "ADMIN" as const,
      id: "usr-demo-admin",
      membership: "SuperAdmin Tier 👑",
      points: 9999,
    },
  ];

  for (const account of demoAccounts) {
    const hashedPassword = await bcrypt.hash(account.plainPassword, 10);
    global.inMemoryUsers!.set(account.email, {
      id: account.id,
      _id: account.id,
      email: account.email,
      password: hashedPassword,
      name: account.name,
      role: account.role,
      membership: account.membership,
      points: account.points,
      isVerified: true,
      avatar: "",
      phone: "",
      address: "",
    });
  }

  // Seed vendor data
  global.inMemoryProducts = [
    {
      id: "prod-demo-1",
      _id: "prod-demo-1",
      vendorId: "usr-demo-vendor",
      name: "Apex Smart Watch Ultra",
      slug: "apex-smart-watch-ultra",
      sku: "APX-WCH-ULT",
      brand: "Apex",
      category: "Electronics",
      description: "A premium smartwatch with heart-rate sensor, GPS and water resistance.",
      price: 299.99,
      discountPrice: 249.99,
      currency: "USD",
      taxRate: 8,
      stock: 25,
      warehouseLocation: "Aisle 4, Shelf B",
      lowStockThreshold: 5,
      status: "Active",
      images: ["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80"],
      variants: [],
      salesCount: 145,
      revenueGenerated: 36248.55,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-demo-2",
      _id: "prod-demo-2",
      vendorId: "usr-demo-vendor",
      name: "Sonic Bass Pro Wireless Headphones",
      slug: "sonic-bass-pro-wireless-headphones",
      sku: "SNC-HDP-BSS",
      brand: "Sonic",
      category: "Electronics",
      description: "Premium wireless over-ear headphones with active noise cancellation.",
      price: 189.99,
      discountPrice: 159.99,
      currency: "USD",
      taxRate: 8,
      stock: 3,
      warehouseLocation: "Aisle 2, Shelf A",
      lowStockThreshold: 5,
      status: "Active",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"],
      variants: [],
      salesCount: 92,
      revenueGenerated: 14719.08,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-demo-3",
      _id: "prod-demo-3",
      vendorId: "usr-demo-vendor",
      name: "Pulse Fit Pro Tracker",
      slug: "pulse-fit-pro-tracker",
      sku: "PLS-FIT-TRK",
      brand: "Pulse",
      category: "Electronics",
      description: "Sleek fitness tracker band with automatic workout detection.",
      price: 99.99,
      discountPrice: 79.99,
      currency: "USD",
      taxRate: 8,
      stock: 0,
      warehouseLocation: "Aisle 4, Shelf C",
      lowStockThreshold: 5,
      status: "Active",
      images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=400&q=80"],
      variants: [],
      salesCount: 210,
      revenueGenerated: 16797.90,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  global.inMemoryOrders = [
    {
      id: "ord-demo-1001",
      _id: "ord-demo-1001",
      orderId: "NATI-1001",
      userId: "usr-demo-customer",
      customerName: "Sarah Connor",
      customerEmail: "sarah.c@gmail.com",
      items: [
        {
          productId: "prod-demo-1",
          name: "Apex Smart Watch Ultra",
          image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
          quantity: 1,
          price: 249.99,
        }
      ],
      totalAmount: 249.99,
      grandTotal: 249.99,
      paymentStatus: "PAID",
      orderStatus: "PROCESSING",
      shippingAddress: {
        street: "742 Evergreen Terrace",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
      },
      trackingNumber: "TRK-NATI-1001-925",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "ord-demo-1002",
      _id: "ord-demo-1002",
      orderId: "NATI-1002",
      userId: "usr-demo-customer",
      customerName: "John Connor",
      customerEmail: "john.c@gmail.com",
      items: [
        {
          productId: "prod-demo-2",
          name: "Sonic Bass Pro Wireless Headphones",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
          quantity: 2,
          price: 159.99,
        }
      ],
      totalAmount: 319.98,
      grandTotal: 319.98,
      paymentStatus: "PAID",
      orderStatus: "SHIPPED",
      shippingAddress: {
        street: "123 Cyberdyne Systems Rd",
        city: "Pasadena",
        state: "CA",
        zipCode: "91101",
      },
      trackingNumber: "TRK-NATI-1002-841",
      createdAt: new Date(Date.now() - 3600 * 24 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 3600 * 24 * 1000),
    }
  ];

  global.inMemoryReviews = [
    {
      id: "rev-demo-1",
      _id: "rev-demo-1",
      productId: "prod-demo-1",
      productName: "Apex Smart Watch Ultra",
      productImage: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
      customerName: "Sarah Connor",
      rating: 5,
      comment: "Incredible watch, battery life is outstanding!",
      createdAt: new Date().toISOString(),
      reply: "Thank you Sarah! Glad you love the battery life.",
      status: "Published",
    },
    {
      id: "rev-demo-2",
      _id: "rev-demo-2",
      productId: "prod-demo-2",
      productName: "Sonic Bass Pro Wireless Headphones",
      productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
      customerName: "John Connor",
      rating: 4,
      comment: "Great sound quality, ANC is decent.",
      createdAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
      status: "Published",
    }
  ];

  global.inMemoryCustomers = [
    { id: "cust-demo-1", name: "Sarah Connor", email: "sarah.c@gmail.com", totalOrders: 3, totalSpent: 749.97, status: "Active" },
    { id: "cust-demo-2", name: "John Connor", email: "john.c@gmail.com", totalOrders: 2, totalSpent: 319.98, status: "Active" },
  ];

  global.inMemoryPayments = {
    transactions: [
      { id: "tx_1001", amount: 249.99, status: "Successful", type: "Order Payment", date: new Date().toISOString().split("T")[0] },
      { id: "tx_1002", amount: 319.98, status: "Successful", type: "Order Payment", date: new Date(Date.now() - 3600 * 24 * 1000).toISOString().split("T")[0] },
    ],
    payouts: [
      { id: "po_1001", amount: 850.00, currency: "USD", status: "Paid", payoutMethod: "Stripe Deposit", bankAccountLast4: "5678", initiatedAt: new Date(Date.now() - 3600 * 24 * 5 * 1000).toISOString().split("T")[0], estimatedArrival: "Delivered" }
    ],
    balance: { available: 569.97, pending: 0, totalEarnings: 67765.53 }
  };

  global.inMemoryProfile = {
    userId: "usr-demo-vendor",
    storeName: "Apex Tech Wearables Store",
    slug: "apex-tech-wearables",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    description: "Your absolute destination for premium sports smartwatches, fitness trackers and audio tech.",
    rating: 4.8,
    totalReviews: 2,
    verified: true,
    productCount: 3,
    joinedDate: "2026-01-15",
    email: "vendor@natistore.com",
    phone: "+1 (555) 832-9210",
    address: { street: "100 Innovation Way", city: "San Jose", state: "CA", zip: "95110", country: "US" },
  };

  global.inMemoryMetrics = {
    totalRevenue: 67765.53,
    revenueChangePercent: 12.8,
    totalOrders: 237,
    ordersChangePercent: 8.5,
    productsSold: 447,
    productsSoldChangePercent: 14.2,
    totalCustomers: 182,
    customersChangePercent: 5.6,
    pendingOrdersCount: 0,
    processingOrdersCount: 1,
    shippedOrdersCount: 1,
    deliveredOrdersCount: 235,
    cancelledOrdersCount: 0,
    lowStockCount: 1,
    outOfStockCount: 1,
  };

  global.inMemoryAnalytics = {
    dailyPerformance: [
      { date: "Jul 23", revenue: 1450, orders: 5, profit: 435, conversionRate: 3.2, views: 240 },
      { date: "Jul 24", revenue: 980, orders: 3, profit: 294, conversionRate: 2.8, views: 210 },
      { date: "Jul 25", revenue: 1800, orders: 6, profit: 540, conversionRate: 4.1, views: 290 },
      { date: "Jul 26", revenue: 2100, orders: 7, profit: 630, conversionRate: 4.5, views: 320 },
      { date: "Jul 27", revenue: 1600, orders: 5, profit: 480, conversionRate: 3.8, views: 270 },
      { date: "Jul 28", revenue: 1950, orders: 6, profit: 585, conversionRate: 4.2, views: 300 },
      { date: "Jul 29", revenue: 249.99, orders: 1, profit: 75, conversionRate: 3.5, views: 180 },
    ],
    categoryBreakdown: [
      { category: "Electronics", revenue: 67765.53, sales: 447 }
    ],
    conversionRate: 3.8,
    averageOrderValue: 285.93,
    repeatCustomerRate: 24.8,
    topGeographicRegions: [
      { region: "California", percentage: 28 },
      { region: "New York", percentage: 18 },
      { region: "Texas", percentage: 14 },
    ]
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

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached!.conn = await cached!.promise;
    import("./dbSeeder").then(m => m.seedDatabaseCollections()).catch(console.error);
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

