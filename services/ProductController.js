import asyncHandler from 'express-async-handler';
import date from 'date-and-time'
import Product from '../models/Product.js';
import User from '../models/User.js';

/*
DESC Get All Product
ROUTE /api/products/get-all-product
METHOD GET
*/
export const getAllProduct = asyncHandler(async (req, res) => {
	let ProductData = await Product.getAllProduct();

	res.status(200).json({
		success: true,
		data: ProductData,
	});
});

/*
DESC Get Product
ROUTE /api/products/get-product
METHOD GET
*/
export const getProduct = asyncHandler(async (req, res) => {
	let ProductData = await Product.getProduct(req.body.product_id);

	res.status(200).json({
		success: true,
		data: ProductData,
	});
});

/*
DESC Filter Product
ROUTE /api/products/filter-product
METHOD POST
*/
export const filterProduct = asyncHandler(async (req, res) => {
	let ProductData = await Product.filterProduct(req.body.keyword);

	res.status(200).json({
		success: true,
		data: ProductData,
	});
});

/*
DESC Create Product
ROUTE /api/products/create-product
METHOD POST
*/
export const createProduct = asyncHandler(async (req, res) => {
	let user = await User.findById(req.id);
	if (user[0].auth_assign !== "Administrator") {
		var err = new Error('Not authrize to access this route');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//count discount_price
	let discount_price = 0;
	if(req.body.discount_percentage != "0"){
		discount_price = (req.body.price * req.body.discount_percentage)/100;
	}

	const insertData = {
		name: req.body.name,
		description: req.body.description,
		brand: req.body.brand,
		category: req.body.category,
		price: req.body.price,
		discount_percentage: req.body.discount_percentage,
		discount_price: discount_price,
		stock: req.body.stock,
		rating: req.body.rating,
		count_review: req.body.count_review,
		image_content: req.body.image_content,
		created_at: new Date(),
		updated_at: new Date()
	};

	const result = await Product.insertProduct(insertData);
	if(result == "success"){
		res.status(200).json({
			success: true,
			message: 'Success create Product',
		});
	}else{
		var err = new Error('Failed create Product, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Update Product
ROUTE /api/products/update-product
METHOD POST
*/
export const updateProduct = asyncHandler(async (req, res) => {
	let user = await User.findById(req.id);
	if (user[0].auth_assign !== "Administrator") {
		var err = new Error('Not authrize to access this route');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//check data
	let searchData =  await Product.getProduct(req.body.product_id);
	if(searchData.length === 0){
		var err = new Error('Product data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//count discount_price
	let discount_price = 0;
	if(req.body.discount_percentage != "0"){
		discount_price = (req.body.price * req.body.discount_percentage)/100;
	}

	const updateData = {
		name: req.body.name,
		description: req.body.description,
		brand: req.body.brand,
		category: req.body.category,
		price: req.body.price,
		discount_percentage: req.body.discount_percentage,
		discount_price: discount_price,
		stock: req.body.stock,
		rating: req.body.rating,
		count_review: req.body.count_review,
		image_content: req.body.image_content,
		updated_at: new Date()
	};

	const result = await Product.updateProduct(updateData,{id: req.body.product_id});
	if(result == "success"){
		let ProductData =  await Product.getProduct(req.body.product_id);
		res.status(200).json({
			success: true,
			data: ProductData,
		});
	}else{
		var err = new Error('Failed update Product, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Delete Product
ROUTE /api/products/delete-product
METHOD POST
*/
export const deleteProduct = asyncHandler(async (req, res) => {
	let user = await User.findById(req.id);
	if (user[0].auth_assign !== "Administrator") {
		var err = new Error('Not authrize to access this route');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//check data
	let searchData =  await Product.getProduct(req.body.product_id);
	if(searchData.length === 0){
		var err = new Error('Product data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const result = await Product.deleteProduct(req.body.product_id);
	if(result == "success"){
		res.status(200).json({
			success: true,
			message: "Success deleted Product data",
		});
	}else{
		var err = new Error('Failed delete Product, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});
