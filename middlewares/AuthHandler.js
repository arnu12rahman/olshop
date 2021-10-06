import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const AuthHandler = asyncHandler(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		var err = new Error('Not authrize to access this route');
        err.status = 401;
		res.status(err.status || 500).json({status: err.status, message: err.message});
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		let user = await User.findById(decoded.id);
		if (user.length === 0) {
			var err = new Error('User Not Found');
			err.status = 404;
			res.status(err.status || 500).json({status: err.status, message: err.message});
			return;
		}

		req.id = decoded.id;
		next();
	} catch (error) {
        var err = new Error();
        err.status = 401;
		res.status(err.status || 500).json({status: err.status, message: error.message});
		return;
	}
});

export default AuthHandler;
