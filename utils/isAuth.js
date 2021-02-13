import fetch from 'isomorphic-unfetch'
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'

async function isAuth(context){

    const cookies = new Cookies(context.req)
	let user, data = null
	let token = cookies.get('token')
    
    if(token) {
		try{
			data = jwt.verify(token, process.env.JWT_SECRET)
		}catch(e) {
			data = false
		}

		if(data){
			const email = data.email
			user = await(await fetch(`${process.env.API_URL}/api/get/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				email,
			}),
			})).json()
		} else data = null
	} else {
		user = null,
		data = null
	} 
	
    return {
        user,
        token
    
    }
}

export default isAuth