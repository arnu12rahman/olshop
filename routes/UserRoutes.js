import express from 'express';
import {
	updateProfile,
	getAddress,
	createAddress,
	updateAddress,
	deleteAddress
} from '../services/UserController.js';
import authHandler from '../middlewares/AuthHandler.js';

const router = express.Router();

router.route('/update-profile').post(authHandler, updateProfile);
router.route('/get-address').get(authHandler, getAddress);
router.route('/create-address').post(authHandler, createAddress);
router.route('/update-address').post(authHandler, updateAddress);
router.route('/delete-address').post(authHandler, deleteAddress);

export default router;
