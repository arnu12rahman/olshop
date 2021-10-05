import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import generateToken from '../libs/generateToken.js';
//import sendMailer from '../libs/sendMail.js';

//@DESC Register User
//@ROUTE /api/auth/register
//@METHOD POST
export const register = asyncHandler(async (req, res) => {
	//check data name, email, password_hash, ada
	if(typeof req.body.email == 'undefined' || typeof req.body.name == 'undefined' || typeof req.body.password == 'undefined'){
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
		name: req.body.name,
		created_at: new Date(),
		updated_at: new Date()
    };
	const insertData = await User.insertData(data);
	if(insertData == "success"){
		let userData =  await User.findOne(data.username);
		res.status(201).json({
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
