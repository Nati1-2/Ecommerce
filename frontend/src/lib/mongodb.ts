import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:rootpassword@localhost:27017/ecom?authSource=admin";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
  var inMemoryUsers: Map<string, any> | undefined;
  var inMemorySeeded: boolean | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

if (!global.inMemoryUsers) {
  global.inMemoryUsers = new Map();
}

// Seed real hashed demo users once per process start
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
      email: "admin@natistore.com",
      plainPassword: "admin123",
      name: "Nati SuperAdmin",
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

  await seedDemoUsers();
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
