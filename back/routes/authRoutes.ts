import { Router } from 'express';
import { login } from '../controllers/authController';
import { register } from '../controllers/authController';
import  { getCurrentUser} from '../controllers/authController';
import  { logoutUser} from '../controllers/authController';

const router = Router();

// POST /api/auth/login

router.post('/login', login);
router.post('/register', register);

// Endpoint: GET /api/auth/current_user
router.get('/current_user', getCurrentUser);
// Endpoint: GET /api/auth/logout
router.get('/logout', logoutUser);
export default router;