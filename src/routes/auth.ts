import { Router } from 'express';
import { googleAuth } from '../controllers/authController';

const router = Router();

/**
 * @openapi
 * /api/auth/google:
 *   post:
 *     summary: Sign in with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token from the mobile app
 *     responses:
 *       200:
 *         description: Returns a JWT and user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Missing idToken
 *       401:
 *         description: Invalid Google token
 */
router.post('/google', googleAuth);

export default router;
