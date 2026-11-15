import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecom';

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
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
    console.log('Connected to MongoDB successfully!');

    const email = 'admin@gmail.com';
    const plainPassword = 'admin';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existing = await User.findOne({ email });
    if (existing) {
      existing.password = hashedPassword;
      existing.role = 'ADMIN';
      existing.membership = 'SuperAdmin Tier 👑';
      existing.isVerified = true;
      await existing.save();
      console.log(`✅ Admin account "${email}" updated successfully with password "${plainPassword}" and role "ADMIN"!`);
    } else {
      await User.create({
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        membership: 'SuperAdmin Tier 👑',
        isVerified: true,
      });
      console.log(`✅ Admin account "${email}" created successfully in database with password "${plainPassword}" and role "ADMIN"!`);
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.warn('Notice: MongoDB is currently unreachable or offline:', err.message);
    console.log('Account is also permanently seeded in frontend/src/lib/mongodb.ts & dbSeeder.ts for zero-downtime runtime & in-memory support.');
  }
}

seedAdmin();

