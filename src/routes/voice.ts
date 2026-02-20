import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { parseTranscript } from '../controllers/voiceController';

const router = Router();

/**
 * @openapi
 * /api/voice/parse:
 *   post:
 *     summary: Parse a voice transcript into a structured event
 *     tags: [Voice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [transcript]
 *             properties:
 *               transcript:
 *                 type: string
 *                 example: Lunch with Sarah next Friday at 1pm at Bella Italia
 *     responses:
 *       200:
 *         description: Structured event extracted from transcript
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     date:
 *                       type: string
 *                       example: 2026-02-27
 *                     time:
 *                       type: string
 *                       example: "13:00"
 *                     location:
 *                       type: string
 *                     notes:
 *                       type: string
 *       400:
 *         description: Missing transcript
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to parse transcript
 */
router.post('/parse', authenticate, parseTranscript);

export default router;
