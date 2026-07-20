import { Router } from 'express';
import { body, param } from 'express-validator';
import { currentUser, requireAuth, validateRequest } from '@ecom/common';
import * as userController from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(currentUser, requireAuth);

// ============================================
// Profile Routes
// ============================================

router.get('/profile', userController.getProfile);

router.put(
  '/profile',
  validateRequest([
    body('firstName')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name must be at most 50 characters'),
    body('lastName')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name must be at most 50 characters'),
    body('avatar')
      .optional()
      .isString()
      .withMessage('Avatar must be a valid URL string'),
    body('phone')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Phone must be at most 20 characters'),
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Date of birth must be a valid ISO 8601 date'),
  ]),
  userController.updateProfile
);

// ============================================
// Address Routes
// ============================================

router.get('/addresses', userController.getAddresses);

router.post(
  '/addresses',
  validateRequest([
    body('label')
      .optional()
      .isIn(['home', 'work', 'other'])
      .withMessage('Label must be home, work, or other'),
    body('street')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Street is required and must be at most 200 characters'),
    body('city')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('City is required and must be at most 100 characters'),
    body('state')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('State is required and must be at most 100 characters'),
    body('zipCode')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Zip code is required and must be at most 20 characters'),
    body('country')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Country is required and must be at most 100 characters'),
    body('isDefault')
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean'),
  ]),
  userController.addAddress
);

router.put(
  '/addresses/:id',
  validateRequest([
    param('id').isMongoId().withMessage('Invalid address ID'),
    body('label')
      .optional()
      .isIn(['home', 'work', 'other'])
      .withMessage('Label must be home, work, or other'),
    body('street')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Street must be at most 200 characters'),
    body('city')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('City must be at most 100 characters'),
    body('state')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('State must be at most 100 characters'),
    body('zipCode')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Zip code must be at most 20 characters'),
    body('country')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Country must be at most 100 characters'),
    body('isDefault')
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean'),
  ]),
  userController.updateAddress
);

router.delete(
  '/addresses/:id',
  validateRequest([
    param('id').isMongoId().withMessage('Invalid address ID'),
  ]),
  userController.deleteAddress
);

export { router as userRoutes };
