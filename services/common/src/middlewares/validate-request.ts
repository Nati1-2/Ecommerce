import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../errors/custom-errors';

/**
 * Runs express-validator chains and throws a ValidationError if any fail.
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(
        errors.array().map((err) => ({
          message: err.msg as string,
          field: 'path' in err ? (err.path as string) : undefined,
        }))
      );
    }

    next();
  };
};
