import express from 'express';
import {
	getAllProduct,
	getProduct,
	filterProduct,
	createProduct,
	updateProduct,
	deleteProduct
} from '../services/ProductController.js';
import authHandler from '../middlewares/AuthHandler.js';

const router = express.Router();

router.route('/get-all-Product').get(getAllProduct);
router.route('/get-Product').post(getProduct);
router.route('/filter-Product').post(filterProduct);
router.route('/create-Product').post(authHandler, createProduct);
router.route('/update-Product').post(authHandler, updateProduct);
router.route('/delete-Product').post(authHandler, deleteProduct);

export default router;
