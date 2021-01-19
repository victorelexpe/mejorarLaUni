import TwitterButton from '../components/twitterButton'
import NavBar from '../components/navBar'
import fetch from 'isomorphic-unfetch'
import isLoggedIn from '../utils/isLoggedIn'

function allIdeas({loggedIn, ideas}) {

    return (
        <>
            <NavBar loggedIn={loggedIn}/>
            <div className="container pt-5 col-md-12 mb-5" style={{minHeight: "100vh"}}>
                {ideas ? (
                <>
                    <h3 className="mt-5">Todas <span className="badge bg-primary">{Object.keys(ideas).length}</span></h3>
                    <div className="row row-cols-md-1 g-4 mt-0">
                        {
                            ideas.map(idea => (
                                <div className="col-md" id={idea._id} key={idea._id}>
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
                </>)}
            </div>
        </>
    )
}

export async function getServerSideProps(context) {

    let loggedIn = false;
	let ideas = await(await fetch(`${process.env.API_URL}/api/posts`)).json()
    let allData = await isLoggedIn(context)

	if(allData.data) {
		if (allData.data.email && allData.user) {
			loggedIn = true;
		}
    }
    
    if(!ideas) ideas = null

	return { 
		props: {
            loggedIn,
            ideas
		}
	}
}

export default allIdeas;