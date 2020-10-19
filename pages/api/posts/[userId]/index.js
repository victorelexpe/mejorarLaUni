import nextConnect from 'next-connect';
import middleware from '../../../../middlewares/middleware';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const posts = await req.db.collection('posts').find({
        creatorId: req.query.userId,
    }).sort({createdAt: -1}).toArray();;
    res.json(posts)
});

export default handler;