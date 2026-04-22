import { Router } from 'express';
import * as controller from './controller';
import { claimLinkSchema } from './schema';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();
router.use(authenticate);

// Medico
router.post('/generate', requireRole('DOCTOR'), controller.generate);
router.get('/dashboard', requireRole('DOCTOR'), controller.getDashboard);

// Paciente
router.post('/claim', requireRole('PATIENT'), validate(claimLinkSchema), controller.claim);

// Ambos
router.get('/', controller.getMyLinks);

export const linksRouter = router;
