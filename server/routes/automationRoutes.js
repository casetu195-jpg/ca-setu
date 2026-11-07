import express from 'express';
import { publishJobFromAutomation } from '../controllers/automationController.js';

const router = express.Router();

// Dedicated secure endpoint for Google Sheets Automation Control Centre
router.route('/publish-job')
  .post(publishJobFromAutomation)
  .get(publishJobFromAutomation);

export default router;
