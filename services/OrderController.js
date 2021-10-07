import asyncHandler from 'express-async-handler';
import date from 'date-and-time'
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import uniqid from 'uniqid';

/*
DESC Get Checkout Details
ROUTE /api/orders/checkout-detail
METHOD GET
*/
export const detailCheckout = asyncHandler(async (req, res) => {
	let CartData = await Cart.getCart(req.id);
	if(CartData.length === 0){
		var err = new Error('Cart data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	let sumOrder = await Cart.sumCart(req.id);
	let addressData = await User.getAddressOne(req.id);

	res.status(200).json({
		success: true,
		data: {
			recipientData: addressData,
			orderData: {
				productCount: CartData.length,
				productData: CartData
			},
			totalAmount: sumOrder[0].price
		},
	});
});

/*
DESC Get Order Master and sample detail product
ROUTE /api/orders/get-orders
METHOD GET
*/
export const getOrders = asyncHandler(async (req, res) => {
	let OrderData = await Order.getOrderData(req.id);
	if(OrderData.length === 0){
		var err = new Error('Order data not found or empty');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	res.status(200).json({
		success: true,
		data: OrderData,
	});
});

/*
DESC Get Order Master and Detail Data
ROUTE /api/orders/get-order
METHOD POST
*/
export const getOrder = asyncHandler(async (req, res) => {
	let OrderData = await Order.getOrderMaster(req.body.order_id);
	if(OrderData.length === 0){
		var err = new Error('Order data not found or empty');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}
	let OrderDetailData = await Order.getOrderDetail(req.body.order_id);
	let OrderResult = {
		order_id: OrderData[0].order_id,
		order_code: OrderData[0].order_code,
		total_price: OrderData[0].total_price,
		receipt_number: OrderData[0].receipt_number,
		recipient_name: OrderData[0].recipient_name,
		recipient_phone: OrderData[0].recipient_phone,
		recipient_address: OrderData[0].recipient_address,
		status: OrderData[0].status,
		note: OrderData[0].note,
		order_date: (OrderData[0].order_date) ? date.format(OrderData[0].order_date,'YYYY-MM-DD') : null,
		payment_method: OrderData[0].payment_method,
		bank_name: OrderData[0].bank_name,
		bank_account_name: OrderData[0].bank_account_name,
		bank_account_number: OrderData[0].bank_account_number,
		payment_date: (OrderData[0].payment_date) ? date.format(OrderData[0].payment_date,'YYYY-MM-DD') : null,
		delivery_service: OrderData[0].delivery_service,
		delivered_date: (OrderData[0].delivered_date) ? date.format(OrderData[0].delivered_date,'YYYY-MM-DD') : null,
		received_date: (OrderData[0].received_date) ? date.format(OrderData[0].received_date,'YYYY-MM-DD') : null,
		detailOrder: OrderDetailData
	}
	res.status(200).json({
		success: true,
		data: OrderResult
	});
});

/*
DESC Create Order
ROUTE /api/orders/create-order
METHOD POST
*/
export const createOrder = asyncHandler(async (req, res) => {
	//validate cart
	let CartData = await Cart.getCart(req.id);
	if(CartData.length === 0){
		var err = new Error('Cart data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//validate recipient address
	let addressData = await User.getAddressById(req.body.address_id);
	if(addressData.length === 0){
		var err = new Error('Recipient data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	let sumOrder = await Cart.sumCart(req.id);
	const order_code = uniqid();
	const insertData = {
		user_id: req.id,
		order_code: order_code,
		delivery_service: req.body.delivery_service,
		total_price: sumOrder[0].price,
		recipient_name: addressData[0].recipient_name,
		recipient_phone: addressData[0].recipient_phone,
		recipient_address: addressData[0].address_1.concat(" ",addressData[0].address_2).concat(" ",addressData[0].address_3),
		note:  req.body.note,
		created_at: new Date(),
		updated_at: new Date()
	};

	const result = await Order.insertOrder(insertData);
	if(result.length !== 0){
		//insert order detail
		for (let i = 0; i < CartData.length; i++) {
			const productData = await Product.getProduct(CartData[i].product_id);
			const insertDataDetail = {
				order_id: result.insertId,
				product_id: CartData[i].product_id,
				product_name: CartData[i].product_name,
				product_desc: productData[0].description,
				product_brand:productData[0].brand,
				product_category:productData[0].category,
				product_price: CartData[i].price,
				product_image: productData[0].image_content,
				quantity: CartData[i].quantity,
				created_at: new Date(),
				updated_at: new Date()
			}
			const resultDetail = await Order.insertOrderDetail(insertDataDetail);

			//remove cartdata
			const resultCart = await Cart.deleteCart(CartData[i].cart_id);

			//update product stock
			let newStock = productData[0].stock - CartData[i].quantity;
			const updateProductData = {
				stock: newStock,
				updated_at: new Date()
			};
			const resultProduct = await Product.updateProduct(updateProductData,{id: CartData[i].product_id});
		};
		res.status(200).json({
			success: true,
			message: 'Success create Order',
		});
	}else{
		var err = new Error('Failed create Order, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Update Order
ROUTE /api/orders/update-order
METHOD POST
*/
export const updateOrder = asyncHandler(async (req, res) => {
	//check data
	let searchOrder =  await Order.getOrderById(req.body.order_id);
	if(searchOrder.length === 0){
		var err = new Error('Order data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}
	let status_data = (req.body.status === null || req.body.status === "" || typeof req.body.status == 'undefined') ? searchOrder[0].status : req.body.status;

	//check user access
	let user = await User.findById(req.id);
	if (user[0].auth_assign !== "Administrator" && status_data !== "received") {
		var err = new Error('Not authorize to access this route');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const updateData = {
		payment_date: (req.body.payment_date === null || req.body.payment_date === "" || typeof req.body.payment_date == 'undefined') ? searchOrder[0].payment_date : req.body.payment_date,
		receipt_number: (req.body.receipt_number === null || req.body.receipt_number === "" || typeof req.body.receipt_number == 'undefined') ? searchOrder[0].receipt_number : req.body.receipt_number,
		delivered_date: (req.body.delivered_date === null || req.body.delivered_date === "" || typeof req.body.delivered_date == 'undefined') ? searchOrder[0].delivered_date : req.body.delivered_date,
		received_date: (req.body.received_date === null || req.body.received_date === "" || typeof req.body.received_date == 'undefined') ? searchOrder[0].received_date : req.body.received_date,
		status: status_data,
		updated_at: new Date()
	};

	const result = await Order.updateOrder(updateData,{id: req.body.order_id});
	if(result == "success"){
		res.status(200).json({
			success: true,
			data: "Success updated Order data"
		});
	}else{
		var err = new Error('Failed update order, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Delete Order
ROUTE /api/orders/delete-order
METHOD POST
*/
export const deleteOrder = asyncHandler(async (req, res) => {
	let searchOrder =  await Order.getOrderById(req.body.order_id);
	if(searchOrder.length === 0){
		var err = new Error('Order data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	let OrderDetailData = await Order.getOrderDetail(req.body.order_id);

	const updateData = {
		status: "canceled",
		updated_at: new Date()
	};

	const result = await Order.updateOrder(updateData,{id: req.body.order_id});
	if(result == "success"){
		//delete order detail
		for (let i = 0; i < OrderDetailData.length; i++) {
			//update product stock
			const productData = await Product.getProduct(OrderDetailData[i].product_id);
			let newStock = productData[0].stock + OrderDetailData[i].quantity;
			const updateProductData = {
				stock: newStock,
				updated_at: new Date()
			};
			const resultProduct = await Product.updateProduct(updateProductData,{id: OrderDetailData[i].product_id});
		};
		res.status(200).json({
			success: true,
			message: "Success deleted Order data",
		});
	}else{
		var err = new Error('Failed delete Order, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Confirmation Payment (upload evidence payment)
ROUTE /api/orders/confirm-payment
METHOD POST
*/
export const confirmPayment = asyncHandler(async (req, res) => {
	//check data
	let searchOrder =  await Order.getOrderById(req.body.order_id);
	if(searchOrder.length === 0){
		var err = new Error('Order data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//check payment evidence
	if(req.body.payment_evidence === null || req.body.payment_evidence === "" || typeof req.body.payment_evidence == 'undefined'){
		var err = new Error('Payment evidence data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const updateData = {
		payment_evidence: req.body.payment_evidence,
		updated_at: new Date()
	};

	const result = await Order.updateOrder(updateData,{id: req.body.order_id});
	if(result == "success"){
		res.status(200).json({
			success: true,
			data: "Success upload evidence payment"
		});
	}else{
		var err = new Error('Failed confirm payment, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Get Order Master and sample detail product based on status
ROUTE /api/orders/status-orders
METHOD POST
*/
export const statusOrders = asyncHandler(async (req, res) => {
	let OrderData = await Order.getStatusOrder(req.id,req.body.status);
	if(OrderData.length === 0){
		var err = new Error('Order data not found or empty');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	res.status(200).json({
		success: true,
		countData: OrderData.length,
		data: OrderData,
	});
});
