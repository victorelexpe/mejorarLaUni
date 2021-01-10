import nextConnect from 'next-connect';
import middleware from '../../middlewares/middleware';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  
  const password = req.body.password;
  const email = normalizeEmail(req.body.email);
  
  if (!isEmail(email)) {
    res.status(400).send('El email introducido no es valido');
    return;
  }
  
  if (!password || !email) {
    res.status(400).send('Missing field(s)');
    return;
  }
  
  req.db.collection('users').findOne({email}, function(err, user) {
    if (err) {
      res.status(500).json({error: true, message: 'Error finding User'});
      return;
    }
    if (!user) {
      res.status(404).json({error: true, message: 'User not found'});
      return;
    } else {
      bcrypt.compare(password, user.password, function(err, match) {
        if (err) {
          res.status(500).json({error: true, message: 'Auth Failed'});
        }
        if (match) {
          const token = jwt.sign(
            {userId: user.userId, email: user.email},
            process.env.JWT_SECRET,
            {
              expiresIn: 3000, //50 minutes
            },
          );

          req.db.collection('users').updateOne( {email: user.email}, {$set: {'lastLogin': new Date().toString()}}, function(err, updatedUser){
            if(err) {
              res.status(404).json({error: true, message: 'Unable to update.'});
              return;
            }
          })
          res.status(200).json({token});
          return;
        } else {
          res.status(401).json({error: true, message: 'Auth Failed'});
          return;
        }
      });
    }
  })
})

export default handler;