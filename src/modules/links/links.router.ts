import { Router } from 'express';
import { 
  generate, claim, getMyDoctor, getPatients, 
  getPatientMedications, prescribeMedication, deletePatientMedication,
  getPatientSymptoms, unlink 
} from './controller';
import { claimLinkSchema } from './schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();
router.use(requireAuth);

router.post('/generate', requireRole('DOCTOR'), generate);
router.post('/claim', requireRole('PATIENT'), validate(claimLinkSchema), claim);
router.get('/my-doctor', requireRole('PATIENT'), getMyDoctor);
router.get('/patients', requireRole('DOCTOR'), getPatients);
router.delete('/unlink', requireRole('PATIENT'), unlink);
router.delete('/:id', requireRole('PATIENT'), unlink);

// Patient management for doctors
router.get('/patients/:id/medications', requireRole('DOCTOR'), getPatientMedications);
router.post('/patients/:id/medications', requireRole('DOCTOR'), prescribeMedication);
router.delete('/patients/:id/medications/:medId', requireRole('DOCTOR'), deletePatientMedication);
router.get('/patients/:id/symptoms', requireRole('DOCTOR'), getPatientSymptoms);

export const linksRouter = router;
