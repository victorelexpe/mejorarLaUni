import nextConnect from 'next-connect'
import {auth, isAdmin} from '../../../../middlewares/auth'
import database from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(database).use(auth)

handler.post(async (req, res) => {

    if(isAdmin(req.user)){

        const slug = req.body.slug
        
        if (!slug) {
            res.status(400).json({error: true, message: 'Missing field(s)'})
            return
        }

        req.db.collection('ideas').deleteOne({"slug": slug}, function(err, idea) {
            
            if (err) {
                res.status(500).json({error: 'Error deleting idea'})
                return
            }
            if(!idea)
                res.status(404).json({error: 'Idea not found'})
            else
                res.status(200).json({message: 'Idea deleted succesfully'})
        })
    } else return res.status(403).json({error: 'Access denied!'})
})

export default handler