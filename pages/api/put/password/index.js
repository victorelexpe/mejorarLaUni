import nextConnect from 'next-connect'
import bcrypt from 'bcrypt'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.put(async (req, res) => {

    // password reset
    if (!req.body.password) {
		res.status(400).json({error: 'Password not provided'})
		return
    }

    const {value: tokenDoc} = await req.db.collection('tokens').findOneAndDelete({ token: req.body.tokenId, type: 'passwordReset' })
    
    if (!tokenDoc) {
		res.status(403).json({error: 'This link may have been expired.'})
		return
    }

    const hash = await bcrypt.hash(req.body.password, 10)
    await req.db.collection('users').updateOne({ _id: tokenDoc.userId }, {$set: { password: hash}}, function (err){
        if(!err){
          	return res.status(200).json({message: 'Contraseña modificada correctamente'})
        }
    })
})

export default handler