import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import voiceRouter from './voice';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/voice', voiceRouter);

export default router;
