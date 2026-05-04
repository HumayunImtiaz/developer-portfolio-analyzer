import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { analyzeUser, getProfile } from '../controllers/github.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { analyzeSchema } from '../validations/github.validation';

const router = Router();

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per `window` (here, per hour)
  message: 'GitHub API limit reached, try later'
});

router.post('/analyze', protect, apiLimiter, validate(analyzeSchema), analyzeUser);
router.get('/profile/:username', getProfile);

export default router;
