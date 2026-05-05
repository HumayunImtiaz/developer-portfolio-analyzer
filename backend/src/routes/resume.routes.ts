import { Router } from 'express';
import { analyzeResume, getResumeHistory } from '../controllers/resume.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';
import { analyzeResumeSchema } from '../validations/resume.validation';

const router = Router();

router.post(
  '/analyze',
  protect,
  uploadMiddleware.single('resume'),
  validate(analyzeResumeSchema),
  analyzeResume
);

router.get('/history', protect, getResumeHistory);

export default router;
