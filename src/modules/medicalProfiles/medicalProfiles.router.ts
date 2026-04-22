import { Router } from 'express';
import { getMyProfile, updateMyProfile } from './controller';
import { updateMedicalProfileSchema } from './schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();
router.use(requireAuth);
router.use(requireRole('PATIENT'));

router.get('/me', getMyProfile);
router.patch('/me', validate(updateMedicalProfileSchema), updateMyProfile);

export const medicalProfilesRouter = router;