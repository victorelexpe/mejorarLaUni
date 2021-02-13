import NavBar from '../components/navbar'
import TwitterButton from '../components/twitterButton'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import isAuth from '../utils/isAuth'

function Home({user, allIdeas}) {
	
	return (
		<>
			<NavBar user={user}/>
			<div className="container pt-5 col-md-12 mb-5" style={{minHeight: "100vh"}}>
				{!user && (
					<>
						<div className="mb-5">
							<h1 className="display-3 text-center">👩‍🎓</h1>
							<h1 className="display-3 text-center fw-bold text-primary">¿Cómo mejorarías la uni?</h1>
							<br></br>
							<h3 className="display-6 text-center fs-sm-4 fs-lg-3">La uni <strong style={{fontWeight: "bold"}}>necesita mejorar</strong>. Todos lo sabemos.
							<br/>Regitrate ahora y <strong style={{fontWeight: "bold"}}>añade tu propuesta.</strong>
							<br/>Juntos podemos hacer posible este <strong style={{fontWeight: "bold"}}>gran cambio.</strong></h3>
						</div>
						<Link href='/signup'><a className="d-flex justify-content-center btn btn-outline-primary btn-lg mx-auto w-50" role="button">Regístrate &rarr;</a></Link>

					
						{allIdeas ? (
						<>
							
							<div className="row row-cols-md-1 g-4 mt-5">
								<h3 className="mt-5">Todas <span className="badge bg-primary">{Object.keys(allIdeas).length}</span></h3>
								{
									allIdeas.map((idea) => (
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
					</> 
				)}
			</div>
		</>
	)
}

export async function getServerSideProps(context) {

	let auth = await isAuth(context)
	let user = auth.user
	let token = auth.token
	
	let allIdeas = await(await fetch(`${process.env.API_URL}/api/get/ideas`)).json()

	if(token && user) {
		context.res.writeHead(302, { Location: `/ideas/${user.slug}` })
        context.res.end()
	} else{
		user = null
		token = null
	}

	if(!allIdeas) allIdeas = null

	return { 
		props: {
			user,
			allIdeas,
		}
	}
}

export default Home
