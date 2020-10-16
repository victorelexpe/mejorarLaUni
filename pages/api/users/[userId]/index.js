import nextConnect from 'next-connect';
import middleware from '../../../../middlewares/middleware';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const user = await req.db.collection('users').findOne({
        name: req.query.userId,
    });
    res.json(user)
});

export default handler;