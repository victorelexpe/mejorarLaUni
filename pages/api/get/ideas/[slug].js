import nextConnect from 'next-connect'
import database from '../../../../middlewares/database'
import {auth} from '../../../../middlewares/auth'

const handler = nextConnect()

handler.use(database).use(auth)

handler.get(async (req, res) => {

    if(req.user.slug == req.query.slug){
        const ideas = await req.db.collection('ideas').find({postedBy: req.user.slug}).project({postedBy: 0, createdAt: 0}).sort({createdAt: -1}).toArray()
        res.status(200).json(ideas) //hide creatorId
    } else res.status(403).json({error: 'Access denied'})
})

export default handler