import fetch from 'isomorphic-unfetch'
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'

async function isLoggedIn(context){

    const cookies = new Cookies(context.req)
    let user, data = null
    
    if(cookies.get('token')) {
		try{
			data = jwt.verify(cookies.get('token'), process.env.JWT_SECRET)
		}catch(e) {
			data = false
		}

		if(data){
			const email = data.email
			user = await(await fetch(`${process.env.API_URL}/api/users/find_user_by_email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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
        data
    
    }
}

export default isLoggedIn