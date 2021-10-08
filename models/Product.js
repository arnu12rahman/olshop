import db from "../config/db.js";

var Product = {};

Product.getAllProduct = () => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT
		id, name, description, brand, category, price real_price, discount_percentage, discount_price, (price-discount_price) price, stock, rating, count_review, image_content
		FROM product WHERE status = 'active'`;
		db.query(sql, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Product.getProduct = (id,flag) => {
	if(flag == "admin"){
		var sql = `SELECT id, name, description, brand, category, price real_price, discount_percentage, discount_price, (price-discount_price) price, stock, rating, count_review, image_content FROM product WHERE id = ?`;
	}else{
		var sql = `SELECT id, name, description, brand, category, price real_price, discount_percentage, discount_price, (price-discount_price) price, stock, rating, count_review, image_content FROM product WHERE status = 'active' and id = ?`;
	}
	return new Promise(function (resolve, reject) {
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

Product.getInactiveProduct = () => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT * FROM product WHERE status = 'inactive'`;
		db.query(sql, (err, result) => {
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
		FROM product WHERE (name like ? or brand like ? or category like ? or description like ?) and status = 'active'`;
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
