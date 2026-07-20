import { NotFoundError, BadRequestError } from '@ecom/common';
import { Profile, IProfile } from '../models/profile.model';
import { Address, IAddress } from '../models/address.model';

// ============================================
// Profile Operations
// ============================================

export const getProfile = async (userId: string): Promise<IProfile> => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new NotFoundError('Profile');
  }
  return profile;
};

export const updateProfile = async (
  userId: string,
  data: Partial<Pick<IProfile, 'firstName' | 'lastName' | 'avatar' | 'phone' | 'dateOfBirth'>>
): Promise<IProfile> => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, runValidators: true, upsert: true }
  );
  if (!profile) {
    throw new NotFoundError('Profile');
  }
  return profile;
};

export const createInitialProfile = async (userId: string): Promise<IProfile> => {
  const existing = await Profile.findOne({ userId });
  if (existing) {
    return existing;
  }

  const profile = Profile.build({ userId });
  await profile.save();
  return profile;
};

// Attach a static build method for type-safe document creation
declare module '../models/profile.model' {
  interface IProfileModel extends import('mongoose').Model<IProfile> {
    build(attrs: { userId: string }): IProfile;
  }
}

Profile.schema.statics.build = function (attrs: { userId: string }) {
  return new Profile(attrs);
};

// ============================================
// Address Operations
// ============================================

export const getAddresses = async (userId: string): Promise<IAddress[]> => {
  return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
};

export const addAddress = async (
  userId: string,
  data: Partial<IAddress>
): Promise<IAddress> => {
  const count = await Address.countDocuments({ userId });
  if (count >= 10) {
    throw new BadRequestError('Maximum of 10 addresses allowed');
  }

  // If this is the first address, make it default
  const isDefault = count === 0 ? true : (data.isDefault ?? false);

  // If setting as default, unset other defaults
  if (isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  const address = new Address({
    ...data,
    userId,
    isDefault,
  });

  await address.save();
  return address;
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: Partial<IAddress>
): Promise<IAddress> => {
  // If setting as default, unset other defaults first
  if (data.isDefault) {
    await Address.updateMany(
      { userId, _id: { $ne: addressId } },
      { isDefault: false }
    );
  }

  const address = await Address.findOneAndUpdate(
    { _id: addressId, userId },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!address) {
    throw new NotFoundError('Address');
  }

  return address;
};

export const deleteAddress = async (
  userId: string,
  addressId: string
): Promise<void> => {
  const address = await Address.findOneAndDelete({ _id: addressId, userId });

  if (!address) {
    throw new NotFoundError('Address');
  }

  // If the deleted address was default, assign default to the most recent one
  if (address.isDefault) {
    const nextDefault = await Address.findOne({ userId }).sort({ createdAt: -1 });
    if (nextDefault) {
      nextDefault.isDefault = true;
      await nextDefault.save();
    }
  }
};
