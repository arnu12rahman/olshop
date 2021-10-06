import express from 'express';
import {
	getCart,
	createCart,
	updateCart,
	deleteCart
} from '../services/CartController.js';
import authHandler from '../middlewares/AuthHandler.js';

const router = express.Router();

router.route('/get-cart').get(authHandler, getCart);
router.route('/create-cart').post(authHandler, createCart);
router.route('/update-cart').post(authHandler, updateCart);
router.route('/delete-cart').post(authHandler, deleteCart);

export default router;
