import { Router } from 'express';
import { register, login, getProfile } from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', requireAuth, getProfile);

export const authRouter = router;
