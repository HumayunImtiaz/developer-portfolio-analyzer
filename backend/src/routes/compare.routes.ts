import { Router } from 'express';
import { compareUsers } from '../controllers/compare.controller';
import { validate } from '../middleware/validate.middleware';
import { compareSchema } from '../validations/github.validation';

const router = Router();

router.post('/', validate(compareSchema), compareUsers);

export default router;
