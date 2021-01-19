import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    
    const id = req.body.id
    
    if (!id) {
        res.status(400).send('Missing field(s)');
        return;
    }

    req.db.collection('users').deleteOne({"_id": id}, function(err, user) {
        
        if (err) {
            res.status(500).json({error: true, message: 'Error deleting User'});
            return;
        }
        if(!user)
            res.status(404).json({error: true, message: 'User not found'});
        else
            res.status(200).json(user);
    })
})

export default handler;