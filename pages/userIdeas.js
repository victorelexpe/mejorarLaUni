import TwitterButton from '../components/twitterButton'
import NavBar from '../components/navBar'
import fetch from 'isomorphic-unfetch'
import isLoggedIn from '../utils/isLoggedIn'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import cookie from 'js-cookie';

function userIdeas({user, loggedIn, userIdeas}) {
    
    let id = null
    if(user)
        id = user._id;

    const router = useRouter()

    function handleSubmit(e) {
		e.preventDefault();
		
		fetch('/api/users/delete_user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id,
			}),
		})
		.then((r) => {
			return r.json();
		})
		.then((data) => {
            cookie.remove('token');
            Router.push('/');
		});
	}

    if(!loggedIn){
        if (typeof window !== 'undefined') {
            router.push('/not_found');
            return; 
          }
    }

    return(
        <>
        {loggedIn && (
            <>
                <NavBar loggedIn={loggedIn}/>
                <div className="container pt-5 col-md-12 mb-5" style={{minHeight: "100vh"}}>
                    <h3>👩‍🎓 Hola, {user.name}!</h3>
                    <p className="text-muted">{user.email}</p>
                    <Link href='/post'>
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
                                    userIdeas.map(idea => (
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

    let allData = await isLoggedIn(context)
    let user = allData.user
    
    let userIdeas = null
    let loggedIn = false

    if(allData.data) {
		if (allData.data.email && user) {
			loggedIn = true;
		}
    }

    if(user) {
		userIdeas = await(await fetch(`${process.env.API_URL}/api/posts/${user._id}`)).json()
	}
    
    if(!user) user = null
    if(!userIdeas) userIdeas = null

    if(!loggedIn){
        if (context.res) {
            context.res.writeHead(302, { Location: '/doesnt_exist' });
            context.res.end();
        }
    }

	return { 
		props: {
            user,
            loggedIn,
            userIdeas
		}
	}
}

export default userIdeas;