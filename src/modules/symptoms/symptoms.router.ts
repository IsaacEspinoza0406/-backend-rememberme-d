import { Router } from 'express';
import * as controller from './controller';
import { logSymptomSchema } from './schema';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();
router.use(authenticate);

// Paciente
router.post('/', requireRole('PATIENT'), validate(logSymptomSchema), controller.logSymptom);
router.get('/history', requireRole('PATIENT'), controller.getHistory);

// Médico (ver historial del paciente)
router.get('/history/:patientId', requireRole('DOCTOR'), controller.getHistory);
router.get('/alerts/:patientId', requireRole('DOCTOR'), controller.getAlerts);

export const symptomsRouter = router;
