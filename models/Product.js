import db from "../config/db.js";

var Product = {};

Product.getAllProduct = () => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT
		id, name, description, brand, category, price real_price, discount_percentage, discount_price, (price-discount_price) price, stock, rating, count_review, image_content
		FROM product`;
		db.query(sql, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Product.getProduct = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT id, name, description, brand, category, price real_price, discount_percentage, discount_price, (price-discount_price) price, stock, rating, count_review, image_content FROM product WHERE id = ?`;
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Product.filterProduct = (keyword) => {
	return new Promise(function (resolve, reject) {
		let keyName = '%' + keyword + '%';
		let keyBrand = '%' + keyword + '%';
		let keyCategory = '%' + keyword + '%';
		let keyDescription = '%' + keyword + '%';
		var sql = `SELECT
		id, name, description, brand, category, price, discount_percentage, discount_price, stock, rating, count_review, image_content
		FROM product WHERE name like ? or brand like ? or category like ? or description like ?`;
		db.query(sql, [keyName,keyBrand,keyCategory,keyDescription], (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Product.insertProduct = (data) => {
	return new Promise(function (resolve, reject) {
		var sql = "INSERT INTO product set ?";
		db.query(sql, [data], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

Product.updateProduct = (data,id) => {
	return new Promise(function (resolve, reject) {
		var sql = "UPDATE product set ? where ?";
		db.query(sql, [data,id], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

Product.deleteProduct = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = "DELETE FROM product where id = ?";
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

export default Product;
