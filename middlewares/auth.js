import jwt from 'jsonwebtoken'

export async function auth(req, res, next) {

    if(req.headers.authorization){

        const token = req.headers.authorization.split(" ").pop()
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded) {

            const email = decoded.email
            const user = await req.db.collection('users').findOne({email})

            if(user){
                const name = user.name
				const slug = user.slug
				const email = user.email
                const role = user.role
                const profilePicture = user.profilePicture

                req.user = {name, email, slug, role, profilePicture}
            }else return res.status(403).json({error: 'Access denied!'})

        } else return res.status(403).json({error: 'Access denied!'})

    }else  return res.status(403).json({error: 'Access denied!'})

    return next()
}

export function isAdmin(user){
    if(user.role == 1)
        return true
    else return false
}
