import express from 'express';
import {
	register
} from '../services/AuthController.js';
import authMiddleware from '../middlewares/AuthHandler.js';

const router = express.Router();

//router.route('/login').post(login);
router.route('/register').post(register);
/*router.route('/me').get(authMiddleware, getMe);
router.route('/updateProfile').put(authMiddleware, updateProfile);
router.route('/updatepassword').put(authMiddleware, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetPassword/:hashToken').put(resetPassword);
*/
export default router;
