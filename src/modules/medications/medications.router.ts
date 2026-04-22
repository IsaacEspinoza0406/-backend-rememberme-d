import { Router } from 'express';
import { getMedications, createMedication } from './controller';
import { createMedicationSchema } from './schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.use(requireAuth);
router.use(requireRole('PATIENT'));

router.get('/', getMedications);
router.post('/', validate(createMedicationSchema), createMedication);

export const medicationsRouter = router;
