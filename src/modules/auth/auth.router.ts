import { Router } from 'express';
import { register, login } from './controller';
import { registerSchema, loginSchema } from './schema';

const router = Router();

// Express validation middleware using Zod
export const validate = (schema: any) => (req: any, res: any, next: any) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (error) {
    next(error);
  }
};

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export const authRouter = router;
