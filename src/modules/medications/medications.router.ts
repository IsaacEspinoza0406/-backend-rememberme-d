import { Router } from 'express';
import { getMedications, createMedication, getMedicationById, updateMedication, deleteMedication } from './controller';
import { createMedicationSchema, updateMedicationSchema } from './schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.use(requireAuth);
router.use(requireRole('PATIENT'));

router.get('/', getMedications);
router.post('/', validate(createMedicationSchema), createMedication);
router.get('/:id', getMedicationById);
router.patch('/:id', validate(updateMedicationSchema), updateMedication);
router.delete('/:id', deleteMedication);

export const medicationsRouter = router;