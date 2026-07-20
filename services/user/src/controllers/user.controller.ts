import { Request, Response } from 'express';
import * as userService from '../services/user.service';

// ============================================
// Profile Controllers
// ============================================

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const profile = await userService.getProfile(req.currentUser!.id);
  res.json({ data: profile });
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, avatar, phone, dateOfBirth } = req.body;
  const profile = await userService.updateProfile(req.currentUser!.id, {
    firstName,
    lastName,
    avatar,
    phone,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
  });
  res.json({ data: profile });
};

// ============================================
// Address Controllers
// ============================================

export const getAddresses = async (req: Request, res: Response): Promise<void> => {
  const addresses = await userService.getAddresses(req.currentUser!.id);
  res.json({ data: addresses });
};

export const addAddress = async (req: Request, res: Response): Promise<void> => {
  const { label, street, city, state, zipCode, country, isDefault } = req.body;
  const address = await userService.addAddress(req.currentUser!.id, {
    label,
    street,
    city,
    state,
    zipCode,
    country,
    isDefault,
  });
  res.status(201).json({ data: address });
};

export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  const { label, street, city, state, zipCode, country, isDefault } = req.body;
  const address = await userService.updateAddress(
    req.currentUser!.id,
    req.params.id,
    { label, street, city, state, zipCode, country, isDefault }
  );
  res.json({ data: address });
};

export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
  await userService.deleteAddress(req.currentUser!.id, req.params.id);
  res.status(204).send();
};
