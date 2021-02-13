import nextConnect from 'next-connect'
import {auth} from '../../../../middlewares/auth'
import database from '../../../../middlewares/database'
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary'
import getPictureName from '../../../../utils/getPictureName'

const handler = nextConnect()

handler.use(database).use(auth)

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

handler.put(upload.single('profilePicture'), async (req, res) => {

  let profilePicture
  let profilePictureName

  if(req.user.profilePicture){
    profilePictureName = getPictureName(req.user.profilePicture)
    
    if(req.file){

      const image = await cloudinary.uploader.upload(req.file.path, {
        folder: req.user.slug,
        type: 'private'
      })
      profilePicture = image.secure_url

      if(profilePictureName != "default")
        cloudinary.uploader.destroy(`${req.user.slug}/${profilePictureName}`)
    }
  } else profilePicture = process.env.DEFAULT_PROFILEPICTURE

  req.db.collection('users').updateOne({slug: req.user.slug },{$set: {"profilePicture": profilePicture}}, function(err, user){
    
    if (err) {
			res.status(500).json({error: 'Error updating user'})
			return
    }
    
    res.status(200).json({message: 'Profile image updated successfully'})
  })
})

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default handler;