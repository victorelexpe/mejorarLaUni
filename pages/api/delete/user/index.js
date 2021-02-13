import nextConnect from 'next-connect'
import {auth, isAdmin} from '../../../../middlewares/auth'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database).use(auth)

handler.post(async (req, res) => {

    const email = req.body.email

    if(req.user.email == email || isAdmin(req.user)){
        
        if (!email) {
            res.status(400).send('Missing field(s)')
            return
        }

        req.db.collection('users').deleteOne({email}, function(err, user) {
            
            if (err) {
                res.status(500).json({error: 'Error deleting User'})
                return
            }
            if(!user)
                res.status(404).json({error: 'User not found'})
            else
                res.status(200).json({user, message: 'User deleted succesfully'})
        })
    } else return res.status(403).json({error: 'Access denied!'})
})

export default handler