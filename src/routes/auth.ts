import { Router } from 'express';
import { googleAuth } from '../controllers/authController';

const router = Router();

// POST /api/auth/google
// Body: { idToken: string }
router.post('/google', googleAuth);

export default router;
