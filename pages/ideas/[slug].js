import TwitterButton from '../../components/twitterButton'
import NavBar from '../../components/navbar'
import fetch from 'isomorphic-unfetch'
import isAuth from '../../utils/isAuth'
import Link from 'next/link'
import Router from 'next/router'
import cookie from 'js-cookie'
import {deleteUser} from '../../actions/users'
import Image from 'next/image'
import { urlObjectKeys } from 'next/dist/next-server/lib/utils'

function userIdeas({user, token, userIdeas}) {

    function handleSubmit(e) {
        e.preventDefault()
        let email = user.email
		deleteUser(email, token).then((data) => {
            if (data && !data.error) {
                cookie.remove('token')
                Router.push('/')
            }
		})
	}

    return(
        <>
        {user && (
            <>
                <NavBar user={user}/>
                <div className="container pt-5 col-md-12 mb-5" style={{minHeight: "100vh"}}>
                    <div className="row mb-3">
                        <div className="col-md-1">
                            {user.profilePicture && (
                                <Image 
                                    src={user.profilePicture}
                                    width={128}
                                    height={128}
                                    className="rounded-circle"
                                />
                            )}
                        </div>
                        <div className="col-md-11">
                            <h3 className="mb-0">Hola, {user.name}!</h3>
                            <p className="text-muted">{user.email}</p>
                        </div>
                    </div>
                    <Link href='/ideas/create'>
                        <a className="btn btn-outline-primary btn-md" role="button">
                            Nueva propuesta &rarr;
                        </a>
                    </Link>
                    <form className="mt-3" onSubmit={handleSubmit}>
                        <button type="submit" className="btn btn-outline-danger btn-sm">Borrar usuario</button>
                    </form>

                    {userIdeas ? (
                        <>
                            <h3 className="mt-5 pt-2">Tus contribuciones <span className="badge bg-primary">{Object.keys(userIdeas).length}</span></h3>
                            <div className="row row-cols-md-1 g-4 mt-0">
                                {
                                    userIdeas.map((idea) => (
                                        <div className="col-md" key={idea._id}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">{idea.title}</h5>
                                                    <h6 className="card-subtitle mb-3 text-muted">{idea.university}</h6>
                                                    <p className="card-text mt-3">{idea.description}</p>
                                                </div>
                                                <TwitterButton title={idea.title} id={idea._id}/>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                        ) : ( <>
                            <p className="lead">Todavía no has registrado ninguna propuesta.</p>
                        </>)
                    }
                </div>
            </>
        )} 
        </>
    )
}

export async function getServerSideProps(context) {

    let auth = await isAuth(context)

    //ideas del que tiene la sesion
    
    let user = auth.user
    let token = auth.token
    let userIdeas = null

    if(token && user) {
        userIdeas = await(await fetch(`${process.env.API_URL}/api/get/ideas/${context.params.slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })).json()

        if(userIdeas.error){
            context.res.writeHead(302, { Location: `/ideas/${user.slug}` })
            context.res.end()
        }
        
	} else {
        user = null
        token = null
        userIdeas = null
        context.res.writeHead(302, { Location: '/' })
        context.res.end()
    }

	return { 
		props: {
            user,
            token,
            userIdeas
		}
	}
}

export default userIdeas