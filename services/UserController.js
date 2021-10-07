import asyncHandler from 'express-async-handler';
import date from 'date-and-time'
import User from '../models/User.js';

/*
DESC Update User Profile
ROUTE /api/users/update-profile
METHOD POST
*/
export const updateProfile = asyncHandler(async (req, res) => {
	let profileData =  await User.getProfile(req.id);
	const updateData = {
		name: (req.body.name === null || req.body.name === "" || typeof req.body.name == 'undefined') ? profileData[0].name : req.body.name,
		profile_account: (typeof req.body.profile_account == 'undefined') ? profileData[0].profile_account : req.body.profile_account,
		gender: (typeof req.body.gender == 'undefined') ? profileData[0].gender : req.body.gender,
		birth_date: (typeof req.body.birth_date == 'undefined') ? profileData[0].birth_date : req.body.birth_date,
		phone: (req.body.phone === null || req.body.phone === "" || typeof req.body.phone == 'undefined') ? profileData[0].phone : req.body.phone,
		updated_at: new Date()
	};

	const updateProfile = await User.updateProfileData(updateData,{id: req.id});
	if(updateProfile == "success"){
		let profileData =  await User.getProfile(req.id);
		res.status(200).json({
			success: true,
			data: {
				id: profileData[0].id,
				name: profileData[0].name,
				profile_account: profileData[0].profile_account,
				gender: profileData[0].gender,
				birth_date: date.format(profileData[0].birth_date,'YYYY-MM-DD'),
				phone: profileData[0].phone,
			},
		});
	}else{
		var err = new Error('Failed update profile, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Get Address
ROUTE /api/users/get-address
METHOD GET
*/
export const getAddress = asyncHandler(async (req, res) => {
	let addressData = await User.getAddress(req.id);

	res.status(200).json({
		success: true,
		data: addressData,
	});
});

/*
DESC Create Address
ROUTE /api/users/create-address
METHOD POST
*/
export const createAddress = asyncHandler(async (req, res) => {
	const insertData = {
		user_id: req.id,
		recipient_name: req.body.recipient_name,
		recipient_phone: req.body.recipient_phone,
		address_1: req.body.address_1,
		address_2: req.body.address_2,
		address_3: req.body.address_3,
		created_at: new Date(),
		updated_at: new Date()
	};

	const result = await User.insertAddress(insertData,{id: req.id});
	if(result == "success"){
		let profileData =  await User.getProfile(req.id);
		res.status(200).json({
			success: true,
			message: 'Success create address',
		});
	}else{
		var err = new Error('Failed create address, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Update Address
ROUTE /api/users/update-address
METHOD POST
*/
export const updateAddress = asyncHandler(async (req, res) => {
	//check data
	let searchData =  await User.getAddressById(req.body.address_id);
	if(searchData.length === 0){
		var err = new Error('Address data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const updateData = {
		recipient_name: (req.body.recipient_name === null || req.body.recipient_name === "" || typeof req.body.recipient_name == 'undefined') ? searchData[0].recipient_name : req.body.recipient_name,
		recipient_phone: (req.body.recipient_phone === null || req.body.recipient_phone === "" || typeof req.body.recipient_phone == 'undefined') ? searchData[0].recipient_phone : req.body.recipient_phone,
		address_1: (req.body.address_1 === null || req.body.address_1 === "" || typeof req.body.address_1 == 'undefined') ? searchData[0].address_1 : req.body.address_1,
		address_2: (typeof req.body.address_2 == 'undefined') ? searchData[0].address_2 : req.body.address_2,
		address_3: (typeof req.body.address_3 == 'undefined') ? searchData[0].address_3 : req.body.address_3,
		updated_at: new Date()
	};

	const result = await User.updateAddress(updateData,{id: req.body.address_id});
	if(result == "success"){
		let addressData =  await User.getAddressById(req.body.address_id);
		res.status(200).json({
			success: true,
			data: addressData,
		});
	}else{
		var err = new Error('Failed update address, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});

/*
DESC Delete Address
ROUTE /api/users/delete-address
METHOD POST
*/
export const deleteAddress = asyncHandler(async (req, res) => {
	//check data
	let searchData =  await User.getAddressById(req.body.address_id);
	if(searchData.length === 0){
		var err = new Error('Address data not found');
		err.status = 404;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	const result = await User.deleteAddress(req.body.address_id);
	if(result == "success"){
		res.status(200).json({
			success: true,
			message: "Success deleted address data",
		});
	}else{
		var err = new Error('Failed delete address, please call administrator.');
		res.status(500).json({status: err.status, message: err.message});
	}
});
