import fetch from 'isomorphic-unfetch'
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'

import Footer from '../components/footer'
import NavBar from '../components/navBar'
import TwitterButton from '../components/twitterButton'
import Link from 'next/link'

function Home({data, allIdeas, userIdeas, user}) {
    
	let loggedIn = false;
	if(data) {
		if (data.email && user) {
			loggedIn = true;
		}
	}
	
	return (
		<>
			<NavBar loggedIn={loggedIn}/>
			<div className="container">
				
				{!loggedIn && (
					<>
						<div className="mb-5">
							<h1 className="display-3 fw-bold text-primary">¿Cómo mejorarías la uni? 👩‍🎓</h1>
							<br></br>
							<h3 className="display-6">La uni <strong>tiene mucho que mejorar</strong>. Te proponemos ser nosotros, los alumnos, quienes la cambiemos a mejor. Manda ideas y nosotros las llevamos a donde importa.
							</h3>
						</div>
						<Link href='/login'><a className="btn btn-outline-primary btn-lg" role="button">Inicia sesión y manda tu propuesta &rarr;</a></Link>
					</>
				)}

				{loggedIn && (
					<>
						<h3>👩‍🎓 Hola, {user.name}!</h3>
						<p className="text-muted">{user.email}</p>
						<Link href='/post'>
							<a className="btn btn-outline-primary btn-lg" role="button">
								Nueva propuesta &rarr;
							</a>
						</Link>
						{userIdeas ? (
							<>
								<h3 className="mt-5 pt-2">Tus contribuciones <span className="badge bg-primary">{Object.keys(userIdeas).length}</span></h3>
								<div className="row row-cols-md-1 g-4 mt-0">
									{
										userIdeas.map(idea => (
											<div className="col" key={idea._id}>
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
						
					</>
				)}
				
				{allIdeas ? (
					<>
						<h3 className="mt-5">Todas <span className="badge bg-primary">{Object.keys(allIdeas).length}</span></h3>
						<div className="row row-cols-md-1 g-4 mt-0">
							{
								allIdeas.map(idea => (
									<div className="col" id={idea._id} key={idea._id}>
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

				<Footer />
			</div>
		</>
	);
}

export async function getServerSideProps(context) {

	const cookies = new Cookies(context.req)

	let user, data, allIdeas, userIdeas = null

	allIdeas = await fetch(`${process.env.API_URL}/api/posts`)
	allIdeas = await allIdeas.json()
	
	if(cookies.get('token')){
		try {
			data = jwt.verify(cookies.get('token'), process.env.JWT_SECRET)
		} catch(e) {
			data = false
		}

		if(data) {
			const email = data.email
			user = await fetch(`${process.env.API_URL}/api/users/find_user_by_email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
				}),
			})
			user = await user.json()
			if(user) {
				userIdeas = await fetch(`${process.env.API_URL}/api/posts/${user._id}`)
				userIdeas = await userIdeas.json()

			}
		}
	} else {
		data = null,
		user = null,
		userIdeas = null
	}
		
	return { 
		props: {
			data,
			allIdeas,
			user,
			userIdeas,
		}
	}
}

export default Home;
