import jwt from 'jsonwebtoken';
import nextConnect from 'next-connect';

const handler = nextConnect();

handler.get(async (req, res) => {
	if (!('token' in req.cookies)) {
		res.status(401).json({message: 'Unable to auth'});
		return;
	}
	let decoded;
	const token = req.cookies.token;
	if (token) {
		try {
			decoded = jwt.verify(token, 'letspingit');
			if (decoded) {
				res.json(decoded);
				return;
			} else {
				res.status(401).json({message: 'Unable to auth'});
			}
		} catch (e) {
			console.log(e);
			decoded = false
		}
	}
})

export default handler