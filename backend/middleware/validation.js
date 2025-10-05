import { body, validationResult } from 'express-validator';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const list = errors.array().map(e => ({
      field: e.path || e.param,
      message: e.msg
    }));
    return res.status(400).json({ message: 'Validation failed', errors: list });
  }
  next();
};

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6')
];

export const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

export const bookCreateRules = [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('author').trim().notEmpty().withMessage('Author required'),
  body('description').trim().notEmpty().withMessage('Description required')
];

export const reviewCreateRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().isString().trim().withMessage('Comment must be text')
];
