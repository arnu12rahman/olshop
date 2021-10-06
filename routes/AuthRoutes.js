import express from 'express';
import {
	register,
	login,
	getMe,
	updatePassword
} from '../services/AuthController.js';
import authHandler from '../middlewares/AuthHandler.js';

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/me').get(authHandler, getMe);
router.route('/update-password').post(authHandler, updatePassword);

export default router;
