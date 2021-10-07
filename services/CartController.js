import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/*
DESC Get All Cart
ROUTE /api/cart/get-cart
METHOD GET
*/
export const getCart = asyncHandler(async (req, res) => {
	let CartData = await Cart.getCart(req.id);

	res.status(200).json({
		success: true,
		data: {
			countData: CartData.length,
			cartData: CartData
		},
	});
});

/*
DESC Create Cart
ROUTE /api/cart/create-cart
METHOD POST
*/
export const createCart = asyncHandler(async (req, res) => {
	//validate product
	let ProductData = await Product.getProduct(req.body.product_id);
	if(ProductData.length === 0){
		var err = new Error('Product data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//validate stock
	if(ProductData[0].stock < req.body.quantity){
		var err = new Error('Out of Stock');
		err.status = 406;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const insertData = {
		user_id: req.id,
		product_id: req.body.product_id,
		quantity: req.body.quantity,
		created_at: new Date(),
		updated_at: new Date()
	};

	const result = await Cart.insertCart(insertData);
	if(result == "success"){
		res.status(200).json({
			success: true,
			message: 'Success create Cart',
		});
	}else{
		var err = new Error('Failed create Cart, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Update Cart
ROUTE /api/cart/update-cart
METHOD POST
*/
export const updateCart = asyncHandler(async (req, res) => {
	//check data
	let searchCart =  await Cart.getCartById(req.body.cart_id);
	if(searchCart.length === 0){
		var err = new Error('Cart data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//validate stock
	let ProductData = await Product.getProduct(searchCart[0].product_id);
	if(ProductData[0].stock < req.body.quantity){
		var err = new Error('Out of Stock');
		err.status = 406;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const updateData = {
		quantity: (typeof req.body.quantity == 'undefined') ? searchCart[0].quantity : req.body.quantity,
		updated_at: new Date()
	};

	const result = await Cart.updateCart(updateData,{id: req.body.cart_id});
	if(result == "success"){
		let CartData =  await Cart.getCart(req.id);
		res.status(200).json({
			success: true,
			data: CartData,
		});
	}else{
		var err = new Error('Failed update Cart, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Delete Cart
ROUTE /api/cart/delete-cart
METHOD POST
*/
export const deleteCart = asyncHandler(async (req, res) => {
	let searchCart =  await Cart.getCartById(req.body.cart_id);
	if(searchCart.length === 0){
		var err = new Error('Cart data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const result = await Cart.deleteCart(req.body.cart_id);
	if(result == "success"){
		res.status(200).json({
			success: true,
			message: "Success deleted Cart data",
		});
	}else{
		var err = new Error('Failed delete Cart, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});
