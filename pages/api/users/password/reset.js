import nextConnect from 'next-connect';
import crypto from 'crypto';
import middleware from '../../../../middlewares/middleware'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'

const smpt = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASS
    },
    tls: {
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    },
    logger: true
});

const handler = nextConnect();

handler.use(middleware)

handler.post(async (req, res) => {

    const user = await req.db.collection('users').findOne({ email: req.body.email });
    
    if (!user) {
      res.status(401).send('The email is not found');
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    await req.db.collection('tokens').insertOne({
      token,
      userId: user._id,
      type: 'passwordReset',
      expireAt: new Date(Date.now() + 1000 * 60 * 20),
    });
    
    smpt.sendMail({
        to: user.email,
        from: 'hello@letspingit.com',
        subject: '[MejorarLaUni] Restablecimeinto de contraseña',
        html: `
        <div>
          <p>Hola, ${user.name}</p>
          <p>Por favor, sigue este <a href="${process.env.API_URL}/forgot_password/${token}">enlace</a> para restablecer tu contraseña.</p>
        </div>
        `,
    }, function (error) {
        if(!error){
            return res.status(200).end();
        } else console.log(error)
    });    
});

handler.put(async (req, res) => {

    // password reset
    if (!req.body.password) {
      res.status(400).send('Password not provided');
      return;
    }

    const {value: tokenDoc} = await req.db.collection('tokens').findOneAndDelete({ token: req.body.tokenId, type: 'passwordReset' });
    
    if (!tokenDoc) {
      res.status(403).send('This link may have been expired.');
      return;
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    await req.db.collection('users').updateOne({ _id: tokenDoc.userId }, {$set: { password: hash}}, function (err){
        if(!err){
          return res.status(200).end();
        }
    });
});

export default handler;