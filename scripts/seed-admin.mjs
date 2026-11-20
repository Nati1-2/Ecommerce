import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required.');
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase().trim() : null;
const plainPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME || 'System Administrator';

if (!email || !plainPassword || plainPassword.length < 8) {
  console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD (minimum 8 characters) must be configured in environment.');
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Admin' },
    role: { type: String, default: 'ADMIN' },
    membership: { type: String, default: 'SuperAdmin Tier 👑' },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully!');

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const existing = await User.findOne({ email });
    if (existing) {
      existing.password = hashedPassword;
      existing.role = 'ADMIN';
      existing.membership = 'SuperAdmin Tier 👑';
      existing.isVerified = true;
      await existing.save();
      console.log(`✅ Admin account "${email}" updated successfully with role "ADMIN"!`);
    } else {
      await User.create({
        email,
        password: hashedPassword,
        name: adminName,
        role: 'ADMIN',
        membership: 'SuperAdmin Tier 👑',
        isVerified: true,
      });
      console.log(`✅ Admin account "${email}" created successfully with role "ADMIN"!`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('❌ Failed to seed admin account:', err.message);
    process.exit(1);
  }
}

seedAdmin();
