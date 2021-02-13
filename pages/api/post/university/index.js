import nextConnect from 'next-connect'
import slugify from 'slugify'
import {auth, isAdmin} from '../../../../middlewares/auth'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database).use(auth)

handler.post(async (req, res) => {

    if(isAdmin(req.user)){

        const name = req.body.name
        let slug
        
        if (!name) {
            res.status(400).json({error: 'Name is required'})
            return
        } else slug = slugify(name).toLowerCase()

        req.db.collection('universities').findOne({slug}, function(err, university) {
            if(err){
                res.status(404).json({error: 'University not found'})
                return
            }

            if(!university){
                req.db.collection('universities').insertOne({name, slug}, function(err) {
            
                    if (err) {
                        res.status(500).json({error: 'Error creating university'})
                        return
                    }
                    
                    res.status(200).json({message: 'University created succesfully'})
                })
            } else {
                res.status(500).json({error: 'University already exists'})
            }
        })
    } else return res.status(403).json({error: 'Access denied!'})
})

export default handler