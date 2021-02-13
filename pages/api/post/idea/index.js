import nextConnect from 'next-connect'
import slugify from 'slugify'
import { v4 } from 'uuid'
import {auth} from '../../../../middlewares/auth'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database).use(auth)

handler.post(async (req, res) => {

    const {title, description, postedBy, university} = req.body.idea

    if(req.user.slug == postedBy){
      
      let slug

      if(!title || !description || !postedBy || !university){
          return res.status(400).send('Faltan campos requeridos')
      } else slug = slugify(title).toLowerCase()

      req.db.collection('users').findOne({"slug": postedBy}, function(err, user) {

        if(err){
          res.status(404).json({error: 'User not found'})
        }

        if(user){
          req.db.collection('ideas').insertOne({
              _id: v4(),
              title,
              slug,
              description,
              university,
              postedBy,
              createdAt: new Date()
          }, function(err) {
              if(err){
                  res.status(400).json({error: 'Error creating idea'})
              }
              res.status(200).json({message: 'Idea created succesfully'})
          })
        } else{
              res.status(403).json({error: 'Debes iniciar sesión para mandar propuestas'})
        }
      })
    } else return res.status(403).json({error: 'Access denied!'})
})

export default handler