import { Router } from 'express';
import { getAnalysis } from '../controllers/analysis.controller';

const router = Router();

router.get('/:username', getAnalysis);

export default router;
