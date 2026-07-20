import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  validateRequest,
  currentUser,
  requireAuth,
} from '@ecom/common';
import {
  register,
  login,
  logout,
  refreshToken,
  verifyUserEmail,
  forgotUserPassword,
  me,
} from '../controllers/auth.controller';

const router = Router();

// ── POST /register ────────────────────────────────
router.post(
  '/register',
  validateRequest([
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),
    body('role')
      .optional()
      .isIn(['CUSTOMER', 'ADMIN', 'VENDOR'])
      .withMessage('Role must be one of: CUSTOMER, ADMIN, VENDOR'),
  ]),
  register
);

// ── POST /login ───────────────────────────────────
router.post(
  '/login',
  validateRequest([
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ]),
  login
);

// ── POST /logout ──────────────────────────────────
router.post(
  '/logout',
  currentUser,
  requireAuth,
  validateRequest([
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ]),
  logout
);

// ── POST /refresh-token ───────────────────────────
router.post(
  '/refresh-token',
  validateRequest([
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ]),
  refreshToken
);

// ── POST /verify-email/:token ─────────────────────
router.post(
  '/verify-email/:token',
  validateRequest([
    param('token')
      .notEmpty()
      .withMessage('Verification token is required')
      .isHexadecimal()
      .withMessage('Invalid token format'),
  ]),
  verifyUserEmail
);

// ── POST /forgot-password ─────────────────────────
router.post(
  '/forgot-password',
  validateRequest([
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
  ]),
  forgotUserPassword
);

// ── GET /me ───────────────────────────────────────
router.get('/me', currentUser, requireAuth, me);

export { router as authRouter };
