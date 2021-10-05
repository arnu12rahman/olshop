import db from "../config/db.js";

var User = {};

User.findOne = (email) => {
	return new Promise(function (resolve, reject) {
		var sql = "SELECT * FROM user WHERE username = ? limit 1";
		db.query(sql, email, (err, result) => {
			if (err) reject(err);

			resolve(result);
		});
	});
};

User.findById = (data) => {
	return new Promise(function (resolve, reject) {
		var sql = "SELECT * FROM user WHERE id ?";
		db.query(sql, [data], (err, result) => {
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

export default User;
