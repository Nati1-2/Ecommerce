import { UserProfile, IUserProfile } from '../models/UserProfile.js';
import { Address, IAddress } from '../models/Address.js';

export class UserService {
  // ── Profile Operations ───────────────────────────────────────────────────
  static async getProfile(authUserId: string) {
    let profile = await UserProfile.findOne({ authUserId });
    if (!profile) {
      // Auto-initialize fallback profile if not exists yet
      profile = await UserProfile.create({
        authUserId,
        firstName: 'User',
        lastName: 'Account',
        status: 'ACTIVE'
      });
    }

    const addresses = await Address.find({ userId: authUserId }).sort({ isDefault: -1, createdAt: -1 });

    return {
      id: profile.authUserId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      name: `${profile.firstName} ${profile.lastName}`,
      phone: profile.phone || '',
      avatar: profile.avatar || '',
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      status: profile.status,
      addresses
    };
  }

  static async updateProfile(authUserId: string, data: Partial<IUserProfile>) {
    let profile = await UserProfile.findOne({ authUserId });
    if (!profile) {
      profile = new UserProfile({ authUserId, firstName: 'User', lastName: 'Account' });
    }

    if (data.firstName) profile.firstName = data.firstName;
    if (data.lastName) profile.lastName = data.lastName;
    if (data.phone !== undefined) profile.phone = data.phone;
    if (data.avatar !== undefined) profile.avatar = data.avatar;
    if (data.dateOfBirth !== undefined) profile.dateOfBirth = data.dateOfBirth;
    if (data.gender !== undefined) profile.gender = data.gender;

    await profile.save();
    return this.getProfile(authUserId);
  }

  static async deleteAccount(authUserId: string) {
    await UserProfile.deleteOne({ authUserId });
    await Address.deleteMany({ userId: authUserId });
    return { message: 'Account and associated profile data deleted successfully' };
  }

  // ── Address Operations ───────────────────────────────────────────────────
  static async createAddress(userId: string, addressData: Partial<IAddress>) {
    const existingCount = await Address.countDocuments({ userId });
    const isFirst = existingCount === 0;

    if (addressData.isDefault || isFirst) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({
      ...addressData,
      userId,
      isDefault: addressData.isDefault || isFirst
    });

    return address;
  }

  static async getUserAddresses(userId: string) {
    return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
  }

  static async updateAddress(userId: string, addressId: string, addressData: Partial<IAddress>) {
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      throw new Error('Address not found or unauthorized');
    }

    if (addressData.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    Object.assign(address, addressData);
    await address.save();

    return address;
  }

  static async deleteAddress(userId: string, addressId: string) {
    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      throw new Error('Address not found or unauthorized');
    }

    if (address.isDefault) {
      const firstRemaining = await Address.findOne({ userId });
      if (firstRemaining) {
        firstRemaining.isDefault = true;
        await firstRemaining.save();
      }
    }

    return { message: 'Address removed successfully' };
  }

  static async setDefaultAddress(userId: string, addressId: string) {
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      throw new Error('Address not found or unauthorized');
    }

    await Address.updateMany({ userId }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    return address;
  }

  // ── Admin Operations ─────────────────────────────────────────────────────
  static async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const users = await UserProfile.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await UserProfile.countDocuments();

    return {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  static async getUserById(authUserId: string) {
    const profile = await UserProfile.findOne({ authUserId });
    if (!profile) {
      throw new Error('User profile not found');
    }
    const addresses = await Address.find({ userId: authUserId });
    return { profile, addresses };
  }

  static async updateUserStatus(authUserId: string, status: 'ACTIVE' | 'BLOCKED') {
    const profile = await UserProfile.findOneAndUpdate(
      { authUserId },
      { status },
      { new: true }
    );
    if (!profile) {
      throw new Error('User profile not found');
    }
    return profile;
  }

  static async deleteUserAdmin(authUserId: string) {
    await UserProfile.deleteOne({ authUserId });
    await Address.deleteMany({ userId: authUserId });
    return { message: 'User deleted by admin' };
  }
}
