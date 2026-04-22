import { Router } from 'express';
import { getMyProfile } from './controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';

const router = Router();
router.use(requireAuth);
router.use(requireRole('PATIENT'));

router.get('/me', getMyProfile);

export const medicalProfilesRouter = router;
