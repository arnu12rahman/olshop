import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import date from 'date-and-time'
import bcrypt from 'bcrypt';
import generateToken from '../libs/generateToken.js';

/*
DESC Register User
ROUTE /api/auth/register
METHOD POST
*/
export const register = asyncHandler(async (req, res) => {
	//check data name, email, password_hash, ada
	if(typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined'){
		var err = new Error('Some data is empty');
        err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message})
		return;
	}

	//check data exist
	const userExist =  await User.findOne(req.body.email);
	if (userExist.length !== 0) {
		var err = new Error('User already exists');
        err.status = 409;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	//insert data
	const salt_data = bcrypt.genSaltSync(10);
	const hash_data = bcrypt.hashSync(req.body.password, salt_data);
	let password_hash = hash_data;
	let data = {
        username: req.body.email,
		password_hash: password_hash,
		email: req.body.email,
		created_at: new Date(),
		updated_at: new Date()
    };
	const insertData = await User.insertData(data);
	if(insertData == "success"){
		let userData =  await User.findOne(data.username);
		const insertProfile = await User.insertProfileData({user_id: userData[0].id,created_at: new Date(),updated_at: new Date()});
		res.status(200).json({
			success: true,
			data: {
				id: userData[0].id,
				username: userData[0].username,
				email: userData[0].username,
				status: userData[0].status,
				token: generateToken(userData[0].id),
			},
		});
	}else{
		var err = new Error('Failed register user, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}

	return;
});

/*
DESC Login User
ROUTE /api/auth/login
METHOD POST
*/
export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const userData = await User.findOne(email);

	if (userData.length == 0) {
		var err = new Error('Data Not Found');
        err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const match = await bcrypt.compare(password, userData[0].password_hash);

	if (match) {
		res.status(200).json({
			success: true,
			data: {
				id: userData[0].id,
				username: userData[0].username,
				email: userData[0].username,
				status: userData[0].status,
				token: generateToken(userData[0].id),
			},
		});
	} else {
		var err = new Error('password incorrect');
        err.status = 401;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}
});

/*
DESC Get Me
ROUTE /api/auth/me
METHOD GET
*/
export const getMe = asyncHandler(async (req, res) => {
	const userData = await User.getUser(req.id);
	if (userData.length == 0) {
		var err = new Error('User Not Found');
        err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	let addressData = await User.getAddress(req.id);
	res.status(200).json({
		success: true,
		data: {
			id: userData[0].user_id,
			username: userData[0].username,
			email: userData[0].email,
			name: userData[0].name,
			profile_account: userData[0].profile_account,
			gender: userData[0].gender,
			birth_date: date.format(userData[0].birth_date,'YYYY-MM-DD'),
			phone: userData[0].phone,
			addressData: addressData
		},
	});
});

/*
DESC Update Password
ROUTE /api/auth/update-password
METHOD POST
*/
export const updatePassword = asyncHandler(async (req, res) => {
	const { oldPassword, newPassword } = req.body;

	if (oldPassword !== newPassword) {
		let user = await User.findById(req.id);

		if (user.length === 0) {
			var err = new Error('User Not Found');
			err.status = 404;
			res.status(err.status || 500).json({status: err.status, message: err.message});
			return;
		}

		const match = bcrypt.compareSync(oldPassword, user[0].password_hash);

		if (!match) {
			var err = new Error('Old password incorrect');
			err.status = 401;
			res.status(err.status || 500).json({status: err.status, message: err.message});
			return;
		}

		const salt_data = bcrypt.genSaltSync(10);
		const hash_data = bcrypt.hashSync(newPassword, salt_data);
		let new_password_hash = hash_data;

		const updateData = {
			password_hash: new_password_hash,
			updated_at: new Date()
		};

		const result = await User.updateData(updateData,{id: req.id});
		if(result == "success"){
			let userData = await User.findById(req.id);
			res.status(200).json({
				success: true,
				data: {
					id: userData[0].id,
					username: userData[0].username,
					email: userData[0].username,
					status: userData[0].status,
					token: generateToken(userData[0].id),
				},
			});
		}else{
			var err = new Error('Failed update password, please call administrator.');
			res.status(500).json({status: err.status, message: err.message});
		}
	}else{
		var err = new Error('Old and new password same, please check again');
		err.status = 406;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}
});
