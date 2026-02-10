import { Router } from 'express';
import { login } from '../controllers/authController';
import { register } from '../controllers/authController';

const router = Router();

// POST /api/auth/login

router.post('/login', login);
router.post('/register', register);
export default router;