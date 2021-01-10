import nextConnect from 'next-connect';
import { v4 } from 'uuid';
import middleware from '../../../middlewares/middleware';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {

    const {title, description, creatorId, university} = req.body;
    if(!title || !description || !creatorId || !university) return res.status(400).send('Faltan campos requeridos');
    if (await req.db.collection('users').countDocuments({ _id: creatorId }) > 0) {
        const post = await req.db
        .collection('posts')
        .insertOne({
          _id: v4(),
          title,
          description,
          university,
          creatorId,
          createdAt: new Date()
        });
        return res.status(200).end();
    }
    return res.status(400).send('Id de creador no válido');
});

handler.get(async (req, res) => {
  const posts = await req.db.collection('posts').find({}).sort({createdAt: -1}).toArray(); // Last input first output (LIFO)
  res.send(posts);
});

export default handler;