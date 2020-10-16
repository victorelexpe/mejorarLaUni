
import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {

    const email = req.body.email;
    req.db.collection('users').findOne({email}, function(err, user) {
      if (err) {
        res.status(500).json({error: true, message: 'Error finding User'});
        return;
      }
      if(!user)
        res.status(404).json({error: true, message: 'User not found'});
      else
        res.status(200).json(user);
    })
  })

  export default handler