const jwt = require('jsonwebtoken');

const verifyAuthToken = async (req, res, next) => {
	// check if theres authorization property in the header
	if (!req.headers['authorization']) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	try {
		// get the token from the authorization
		const token = req.headers['authorization'].split(' ')[1];
		//verify the token
		let payload = jwt.verify(token, process.env.JWT_SECRET);
		// console.log('jwt entered');
		if (!payload) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// assign the userId from the payload to the request userId
		req.userId = payload.userId;
		next();
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Invalid token' });
		} else if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token has expired' });
		}
		next(err);
	}
};

module.exports = verifyAuthToken;
