import nextConnect from 'next-connect'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.get(async (req, res) => {

    const ideas = await req.db.collection('ideas').find({}).project({postedBy: 0, createdAt: 0}).sort({createdAt: -1}).toArray()
    res.status(200).json(ideas)
})


export default handler
  