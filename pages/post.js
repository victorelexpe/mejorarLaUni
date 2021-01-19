import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch'
import NavBar from '../components/navBar'
import isLoggedIn from '../utils/isLoggedIn'

const addPost = ({user, loggedIn, universities}) => {

	const router = useRouter()
	const [errorMsg, setErrorMsg] = useState('');
	const [succesMsg, setSuccesMsg] = useState('');

	useEffect(() => {
			// redirect to login if user is not authenticated
			if (!user) router.replace('/login');
	}, [user]);

	const handleSubmit = async (e) => {
			e.preventDefault();
			const body = {
					title: e.currentTarget.title.value,
					description: e.currentTarget.description.value,
					creatorId: user._id,
					university: e.currentTarget.university.value
			}
			if((!body.title || !body.title.length) || (!body.description || !body.description.length) || (!body.university || !body.university.length)) return setErrorMsg("Todos los campos son obligatorios");

			setErrorMsg();

			const res = await fetch('/api/posts', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
			});

			if(res.status === 200) {
					setSuccesMsg("Propuesta guardada correctamente");
					setTimeout(() => {
							router.replace('/');
					}, 2000);
			} else {
					setErrorMsg(await res.text());
			}
	}

	return (
		<>
			<NavBar loggedIn={loggedIn}/>
			<div className="container mt-5 col-md-6" style={{minHeight: "100vh"}}>
				{errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
				{succesMsg ? <p style={{ color: 'green' }}>{succesMsg}</p> : null}
				<h2 className="mb-3">Nueva idea</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-floating mb-3">
						<input
							className="form-control"
							id="title"
							placeholder="Título de la idea"
							type="text"
							name="title"
							required={true}
						/>
						<label htmlFor="title">Título de la idea</label>
					</div>
					<div className="form-floating mb-3">
						<textarea
							className="form-control"
							placeholder="Descripción de la propuesta"
							type="text"
							id="description"
							name="description"
							maxLength="500"
							required={true}
							style={{height: "150px"}}
						/>
						<label htmlFor="description">Descripción de la idea</label>
					</div>	
					<div className="form-floating mb-3">
						<select className="form-select" id="floatingSelect" name="university" required={true}>
							{
								universities.map(university => (
									<option key={university._id}>{university.name}</option>
								))
							}
							</select>
							<label htmlFor="floatingSelect">Universidad a mejorar</label>
					</div>
					<button className="btn btn-primary" type="submit">Guardar &rarr;</button>						
				</form>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {

	let loggedIn = false
	let universities = await (await fetch(`${process.env.API_URL}/api/universities`)).json();
	let allData = await isLoggedIn(context)

	if(allData.data) {
		if (allData.data.email && allData.user) {
			loggedIn = true;
		}
	}

	let user = allData.user

	if(!universities) universities = null
	if(!user) user = null
	
	return { 
		props: {
			user,
			loggedIn,
			universities
		}
	}
}

export default addPost;