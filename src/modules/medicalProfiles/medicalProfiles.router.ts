import { Router } from 'express';
import { getProfile, updateProfile } from './controller';
import { updateMedicalProfileSchema } from './schema';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole('PATIENT'));

router.get('/', getProfile);
router.put('/', validate(updateMedicalProfileSchema), updateProfile);

export const medicalProfilesRouter = router;
