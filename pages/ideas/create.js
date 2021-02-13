import React, { useState} from 'react'
import fetch from 'isomorphic-unfetch'
import NavBar from '../../components/navBar'
import isAuth from '../../utils/isAuth'
import Router from 'next/router'
import {createIdea} from '../../actions/ideas'

const addPost = ({user, token, universities}) => {
	
	const [values, setValues] = useState({
		title: '',
		description: '',
		error: '',
		message: '',
		succes: false
    })

	const {title, description, error, message} = values

	const handleSubmit = async (e) => {
		e.preventDefault()

		let postedBy = user.slug
		let university = e.currentTarget.university.value

		createIdea({title, description, postedBy, university}, token).then((data) => {
			if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			} else{
				setValues({...values, title: '', description: '', university: '', error: '', message: data.message})
				Router.push(`/ideas/${user.slug}`)
			}
		})
	}

	const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value, error: ''})
    }
	
	const showError = () => (error ? <div className="alert alert-danger mt-3" onMouseOver={mouseMoveHandler}>{error}</div> : '')
    const showMessage = () => (message ? <div className="alert alert-success mt-3">{message}</div> : '')
    const mouseMoveHandler = e => {
        setValues({ ...values, error: ''})
    }


	return (
		<>
			<NavBar user={user}/>
			<div className="container mt-5 col-md-6" style={{minHeight: "100vh"}}>
				<h2 className="mb-3">Nueva idea</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-floating mb-3">
						<input
							className="form-control"
							id="title"
							placeholder="Título de la idea"
							type="text"
							name="title"
							onChange={handleChange('title')}
							required
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
							onChange={handleChange('description')}
							required
							style={{height: "150px"}}
						/>
						<label htmlFor="description">Descripción de la idea</label>
					</div>	
					<div className="form-floating mb-3">
						<select className="form-select" id="floatingSelect" name="university" required={true}>
							{
								universities.map((university, i) => (
									<option key={i}>{university.name}</option>
								))
							}
						</select>
						<label htmlFor="floatingSelect">Universidad a mejorar</label>
					</div>
					<button className="btn btn-primary" type="submit">Guardar &rarr;</button>						
				</form>
				{showError()}
				{showMessage()}
			</div>
		</>
	)
}

export async function getServerSideProps(context) {

    let auth = await isAuth(context)
    
    let user = auth.user
    let token = auth.token
	let universities = null

	if(token && user) {
		universities = await (await fetch(`${process.env.API_URL}/api/get/universities`)).json()
	} else {
        user = null
        token = null
        universities = null
        context.res.writeHead(302, { Location: '/' })
        context.res.end()
    }
	
	return { 
		props: {
			user,
			token,
			universities
		}
	}
}

export default addPost