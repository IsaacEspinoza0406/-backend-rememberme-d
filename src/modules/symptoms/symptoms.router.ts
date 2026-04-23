import { Router } from 'express';
import { createSymptom, getSymptoms } from './controller';
import { createSymptomSchema } from './schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.use(requireAuth);
router.use(requireRole('PATIENT'));

router.get('/', getSymptoms);
router.post('/', validate(createSymptomSchema), createSymptom);

export const symptomsRouter = router;
