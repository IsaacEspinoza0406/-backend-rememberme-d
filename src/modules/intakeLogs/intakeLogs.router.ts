import { Router } from 'express';
import { getToday, confirm } from './controller';
import { updateStatusSchema } from './schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.use(requireAuth);
router.use(requireRole('PATIENT'));

router.get('/today', getToday);
router.patch('/:id/confirm', validate(updateStatusSchema), confirm);

export const intakeLogsRouter = router;
