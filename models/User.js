import db from "../config/db.js";

var User = {};

User.findOne = (email) => {
	return new Promise(function (resolve, reject) {
		var sql = "SELECT * FROM user WHERE email = ? limit 1";
		db.query(sql, email, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

User.findById = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = "SELECT * FROM user WHERE id = ?";
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

User.getUser = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT a.id user_id, a.username, a.email,
		b.name, b.profile_account, b.gender, b.birth_date, b.phone,
		c.recipient_name, c.recipient_phone, c.address_1, c.address_2, c.address_3 FROM user a
		LEFt JOIN profile b on a.id = b.user_id
		LEFT JOIN address c on a.id = c.user_id
		WHERE a.id = ? limit 1`;
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

User.getProfile = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = "SELECT * FROM profile WHERE user_id = ? limit 1";
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

User.insertData = (data) => {
	return new Promise(function (resolve, reject) {
		var sql = "INSERT INTO user set ?";
		db.query(sql, [data], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

User.updateData = (data,id) => {
	return new Promise(function (resolve, reject) {
		var sql = "UPDATE user set ? where ?";
		db.query(sql, [data,id], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

User.insertProfileData = (data) => {
	return new Promise(function (resolve, reject) {
		var sql = "INSERT INTO profile set ?";
		db.query(sql, [data], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

User.updateProfileData = (data,id) => {
	return new Promise(function (resolve, reject) {
		var sql = "UPDATE profile set ? where ?";
		db.query(sql, [data,id], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

User.getAddress = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT a.id user_id, b.id profile_id, c.id address_id, c.recipient_name, c.recipient_phone, c.address_1, c.address_2, c.address_3 FROM user a
		LEFt JOIN profile b on a.id = b.user_id
		LEFT JOIN address c on a.id = c.user_id
		WHERE a.id = ?`;
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

User.getAddressById = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = `SELECT id address_id, recipient_name, recipient_phone, address_1, address_2, address_3 FROM address WHERE id = ?`;
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

User.insertAddress = (data) => {
	return new Promise(function (resolve, reject) {
		var sql = "INSERT INTO address set ?";
		db.query(sql, [data], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

User.updateAddress = (data,id) => {
	return new Promise(function (resolve, reject) {
		var sql = "UPDATE address set ? where ?";
		db.query(sql, [data,id], (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

User.deleteAddress = (id) => {
	return new Promise(function (resolve, reject) {
		var sql = "DELETE FROM address where id = ?";
		db.query(sql, id, (err, result) => {
			if (err) reject(err);

			resolve("success");
		});
	});
};

export default User;
