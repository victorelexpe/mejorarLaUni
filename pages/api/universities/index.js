import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const universities = await req.db.collection('universities').find({}).toArray();
    res.json(universities)
});

export default handler;