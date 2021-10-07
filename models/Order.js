import db from "../config/db.js";

var Order = {};

Order.getOrderData = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT a.id order_id, a.order_code, a.total_price,
		b.product_name sample_product_name, b.product_image sample_product_image, b.quantity sample_product_quantity,
		b.product_price sample_product_price, COUNT(b.product_name) product_total
		FROM order_master a
		INNER JOIN order_detail b on b.order_id = a.id
		WHERE a.status != "canceled" AND a.user_id = ?
		GROUP BY a.order_code`;
		db.query(sql,id,(err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Order.getOrderMaster = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT id order_id, order_code, total_price, receipt_number, recipient_name, recipient_phone,
		recipient_address, status, note, created_at as order_date, payment_date,
		delivery_service, delivered_date, received_date
		FROM order_master
		WHERE status != "canceled" AND user_id = ?`;
		db.query(sql,id,(err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Order.getOrderDetail = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT id detail_id, product_id, product_name, product_image, product_price, quantity FROM order_detail WHERE order_id = ?`;
		db.query(sql,id,(err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Order.getOrderById = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT * FROM order_Master WHERE id = ?`;
		db.query(sql,id,(err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Order.insertOrder = (data) => {
	return new Promise(function (resolve, reject) {
		var sql = "INSERT INTO order_master set ?";
		db.query(sql, [data], (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Order.insertOrderDetail = (data) => {
	return new Promise(function (resolve, reject) {
		var sql = "INSERT INTO order_detail set ?";
		db.query(sql, [data], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

Order.updateOrder = (data,id) => {
	return new Promise(function (resolve, reject) {
		var sql = "UPDATE order_master set ? where ?";
		db.query(sql, [data,id], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

Order.deleteDetailOrder = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = "DELETE FROM order_detail where id = ?";
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

export default Order;
