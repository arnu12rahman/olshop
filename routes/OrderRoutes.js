import express from 'express';
import {
	detailCheckout,
	getOrder,
	getOrders,
	createOrder,
	updateOrder,
	deleteOrder
} from '../services/OrderController.js';
import authHandler from '../middlewares/AuthHandler.js';

const router = express.Router();

router.route('/checkout-detail').get(authHandler, detailCheckout);
router.route('/get-orders').get(authHandler, getOrders);
router.route('/get-order').post(authHandler, getOrder);
router.route('/create-order').post(authHandler, createOrder);
router.route('/update-order').post(authHandler, updateOrder);
router.route('/cancel-order').post(authHandler, deleteOrder);

export default router;
