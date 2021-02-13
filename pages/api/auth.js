import nextConnect from 'next-connect'
import isEmail from 'validator/lib/isEmail'
import normalizeEmail from 'validator/lib/normalizeEmail'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import database from '../../middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.post(async (req, res) => {
	
	const password = req.body.password
	const email = normalizeEmail(req.body.email)

	if (!isEmail(email)) {
		res.status(400).send('El email introducido no es valido')
		return
	}

	req.db.collection('users').findOne({email}, function(err, user) {
		if (err) {
			res.status(500).json({error: 'Error finding User'})
			return
		}
		if (!user) {
			res.status(404).json({error: 'Email o contraseña es incorrectos. Intentalo de nuevo!'})
			return
		} else {
			bcrypt.compare(password, user.password, function(err, match) {
				if (err) {
					res.status(500).json({error: 'Email o contraseña es incorrectos. Intentalo de nuevo!'})
				}
				if (match) {
					const token = jwt.sign(
						{userId: user.userId, email: user.email},
						process.env.JWT_SECRET,
						{
							expiresIn: '1d',
						},
					)

					const slug = user.slug

					req.db.collection('users').updateOne( {email: user.email}, {$set: {'lastLogin': new Date().toString()}}, function(err, updatedUser){
						if(err) {
							res.status(500).json({error: 'Unable to update.'})
							return
						}
					})
					res.status(200).json({slug, token})
					return
				} else {
					res.status(401).json({error: 'Email o contraseña es incorrectos. Intentalo de nuevo!'})
					return
				}
			})
		}
	})
})

export default handler