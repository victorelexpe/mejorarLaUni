import nextConnect from 'next-connect'
import {auth} from '../../../../middlewares/auth'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database).use(auth)

handler.post(async (req, res) => {

	const email = req.body.email

	if(req.user.email == email){

		req.db.collection('users').findOne({email}, function(err, user) {
			if (err) {
				res.status(500).json({error: 'Error finding User'})
				return
			}
			if(!user)
				res.status(404).json({error: 'User not found'})
			else{

				const name = user.name
				const slug = user.slug
				const email = user.email
				const role = user.role
				const profilePicture = user.profilePicture
				
				res.status(200).json({name, email, slug, role, profilePicture})
			}
		})
	} else return res.status(403).json({error: 'Access denied!'})
})

export default handler