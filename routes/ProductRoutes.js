import express from 'express';
import {
	getAllProduct,
	getProduct,
	getInactiveProduct,
	filterProduct,
	createProduct,
	updateProduct,
	deleteProduct
} from '../services/ProductController.js';
import authHandler from '../middlewares/AuthHandler.js';

const router = express.Router();

router.route('/get-all-product').get(getAllProduct);
router.route('/get-product').post(getProduct);
router.route('/get-inactive-product').get(authHandler, getInactiveProduct);
router.route('/filter-product').post(filterProduct);
router.route('/create-product').post(authHandler, createProduct);
router.route('/update-product').post(authHandler, updateProduct);
router.route('/delete-product').post(authHandler, deleteProduct);

export default router;
