
import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import assert from 'assert';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

const handler = nextConnect();

handler.use(middleware);

function createUser(db, name, email, password, callback) {
  const collection = db.collection('users');
  bcrypt.hash(password, 10, function(err, hash) {
    // Store hash in your password DB.
    collection.insertOne(
      {
        _id: v4(),
        name,
        email,
        password: hash,
        date: Date.now()
        //name,
        //emailVerified: false
      },
      function(err, userCreated) {
        assert.strictEqual(err, null);
        callback(userCreated);
      },
    );
  });
}

handler.post(async (req, res) => {

  const name = req.body.name;
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;
  
  if (!isEmail(email)) {
    res.status(400).send('El email introducido no es valido');
    return;
  }
  if (!email || !name || !password) {
    res.status(400).send('Missing field(s)');
    return;
  }
  req.db.collection('users').findOne({email}, function(err, user) {
    if (err) {
      res.status(500).json({error: true, message: 'Error finding User'});
      return;
    }
    if (!user) {
      // proceed to Create
      createUser(req.db, name, email, password, function(creationResult) {
        if (creationResult.ops.length === 1) {
          const user = creationResult.ops[0];
          const token = jwt.sign(
            {userId: user.userId, email: user.email},
            process.env.JWT_SECRET,
            {
              expiresIn: 3000, //50 minutes
            },
          );
          res.status(200).json({token});
          return;
        }
      });
    } else {
      // User exists
      res.status(403).json({error: true, message: 'Username or Email exists'});
      return;
    }
  })
})

export default handler;
