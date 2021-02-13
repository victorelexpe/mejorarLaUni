import nextConnect from 'next-connect'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import database from '../../../../middlewares/database'

const smpt = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASS
    },
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false
		},
    logger: true
})

const handler = nextConnect()

handler.use(database)

handler.post(async (req, res) => {

    const user = await req.db.collection('users').findOne({ email: req.body.email })
    
    if (!user) {
      res.status(401).json({error: 'El email que has introducido no es válido'})
      return
    }

    const token = crypto.randomBytes(32).toString('hex')
    await req.db.collection('tokens').insertOne({
		token,
		userId: user._id,
		type: 'passwordReset',
		expireAt: new Date(Date.now() + 1000 * 60 * 20),
    })

    smpt.sendMail({
        to: user.email,
        from: 'hello@letspingit.com',
        subject: '[MejorarLaUni] Restablecimeinto de contraseña',
        html: `
        <div>
          <p>Hola, ${user.name}</p>
          <p>Por favor, sigue este <a href="${process.env.API_URL}/password/reset/${token}">enlace</a> para restablecer tu contraseña.</p>
        </div>
        `,
    }, function (error) {
        if(!error){
            return res.status(200).json({message: 'Por favor, revisa tu bandeja de entrada'})
        } else return res.status(400).json({error: 'No se ha podido enviar el mensaje'})
    })
})

export default handler