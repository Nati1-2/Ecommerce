import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:rootpassword@localhost:27017/ecom?authSource=admin";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
  var inMemoryUsers: Map<string, any> | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

if (!global.inMemoryUsers) {
  global.inMemoryUsers = new Map();
}

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
