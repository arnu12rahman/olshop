import db from "../config/db.js";

var Cart = {};

Cart.getCartById = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT * FROM cart WHERE id = ?`;
		db.query(sql,id,(err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Cart.getCart = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT
		a.id cart_id, a.user_id, a.product_id, a.quantity, c.name product_name, ((c.price-c.discount_price)*a.quantity) price, c.image_content
		FROM cart a
		INNER JOIN user b on b.id = a.user_id
		INNER JOIN product c on c.id = a.product_id
		WHERE a.user_id = ?`;
		db.query(sql,id,(err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Cart.insertCart = (data) => {
	return new Promise(function (resolve, reject) {
		var sql = "INSERT INTO cart set ?";
		db.query(sql, [data], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

Cart.updateCart = (data,id) => {
	return new Promise(function (resolve, reject) {
		var sql = "UPDATE cart set ? where ?";
		db.query(sql, [data,id], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

Cart.deleteCart = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = "DELETE FROM cart where id = ?";
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

export default Cart;
