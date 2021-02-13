import nextConnect from 'next-connect'
import {auth, isAdmin} from '../../../../middlewares/auth'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database).use(auth)

handler.get(async (req, res) => {

    if(isAdmin(req.user)){
        const users = await req.db.collection('users').find({}).project({_id: 0, password: 0, signupDate: 0, lastLogin: 0}).sort({'slug': 1}).toArray()
        res.status(200).json(users) //hide password
    } else return res.status(403).json({error: 'Access denied!'})

})

export default handler
  