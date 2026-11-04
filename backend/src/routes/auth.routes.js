import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, updateMe, changePassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/schemas.js';

const router = express.Router();

// Slow down brute-force attempts on credential endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many attempts, please try again in 15 minutes' },
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

router.get('/me', protect, getMe);
router.patch('/me', protect, validate(updateProfileSchema), updateMe);
router.patch('/password', protect, validate(changePasswordSchema), changePassword);

export default router;
