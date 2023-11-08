const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.mapped() });
		}

		const { email, name, password } = req.body;

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			email,
			name,
			password: hashedPassword,
		});

		const token = jwt.sign(
			{
				email: user.email,
				userId: user._id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		await user.save();
		res.status(201).json({
			success: true,
			token,
			user,
		});
	} catch (err) {
		next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ error: 'User with this email does not exist' });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Incorrect password' });
		}

		const token = jwt.sign(
			{
				email: user.email,
				userId: user._id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.status(200).json({ success: true, token, user: user._id });
	} catch (error) {
		next(error);
	}
};
