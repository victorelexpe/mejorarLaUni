import nextConnect from 'next-connect'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.get(async (req, res) => {
    const universities = await req.db.collection('universities').find({}).project({_id: 0}).sort({"slug": 1}).toArray()
    res.status(200).json(universities)
})

export default handler