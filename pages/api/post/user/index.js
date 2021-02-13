import nextConnect from 'next-connect'
import isEmail from 'validator/lib/isEmail'
import normalizeEmail from 'validator/lib/normalizeEmail'
import assert from 'assert'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import slugify from 'slugify'
import database from '../../../../middlewares/database'
import getPictureName from '../../../../utils/getPictureName'

const handler = nextConnect()

handler.use(database)

function createUser(db, name, email, slug, password, role, profilePictureName, profilePicture, callback) {
	const collection = db.collection('users')
	bcrypt.hash(password, 10, function(err, hash) {
		// Store hash in your password DB.
		collection.insertOne(
			{
			_id: v4(),
			name,
			slug,
			email,
			password: hash,
			role,
			profilePictureName,
			profilePicture,
			signupDate: new Date().toString(),
			//emailVerified: false
			},
			function(err, userCreated) {
				assert.strictEqual(err, null)
				callback(userCreated)
			},
		)
	})
}

handler.post(async (req, res) => {

	const name = req.body.user.name
	const slug = slugify(name).toLocaleLowerCase()
	const email = normalizeEmail(req.body.user.email)
	const password = req.body.user.password
	const profilePicture = process.env.DEFAULT_PROFILEPICTURE
	const profilePictureName = getPictureName(profilePicture)
	const role = 0

	if (!isEmail(email)) {
		res.status(400).send('El email introducido no es valido')
		return
	}

	if (!email || !name || !password) {
		res.status(400).json({error: 'Missing field(s)'})
		return
	}
	
	req.db.collection('users').findOne({email}, function(err, data) {
		
		if (err) {
			res.status(500).json({error: 'Error finding User'})
			return
		}

		if(!data){

			req.db.collection('users').findOne({slug}, function(err, user) {
			
				if (err) {
					res.status(500).json({error: 'Error finding User'})
					return
				}
			
				if (!user) {
					createUser(req.db, name, email, slug, password, role, profilePictureName, profilePicture, function(userCreated, err) {
					
						if(err){
							res.status(400).json({error: 'Error creating user'})
						}

						if(userCreated){
							if (userCreated.ops.length === 1) {
								const user = userCreated.ops[0]
								res.status(200).json({user, message: 'User created successfully'})
								return
							}
						}
					})
				} else {
					// User exists
					res.status(400).json({error: 'Username already exists'})
					return
				}
			})
		} else {
			// User exists
			res.status(400).json({error: 'Email already exists'})
			return
		}
	})
})

export default handler
