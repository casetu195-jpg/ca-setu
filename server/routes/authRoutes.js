import express from 'express';
import { register, login, getMe, founderSetup } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/founder-setup', founderSetup);
router.get('/me', protect, getMe);

export default router;
