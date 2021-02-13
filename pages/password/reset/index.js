import React from 'react'
import Router from 'next/router'
import NavBar from '../../../components/navbar'
import {useState } from 'react'

const ForgotPasswordPage = () => {

	const [values, setValues] = useState({
        email: '',
        error: '',
        message: ''
	})
	
	const {email, error, message} = values

	async function handleSubmit(e) {

		e.preventDefault(e)
		
		fetch('/api/post/password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({email}),
		})
		.then((r) => {
			return r.json()
		})
		.then((data) => {
			if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			}else {
                setValues({...values, email: '', error: '', message: data.message})
				Router.replace('/')
			}	
		})
	}

	const handleChange = e => {
        setValues({ ...values, email: e.target.value, error: ''})
	}
	const showError = () => (error ? <div className="alert alert-danger" onMouseOver={mouseMoveHandler}>{error}</div> : '')
    const showMessage = () => (message ? <div className="alert alert-success">{message}</div> : '')
	const mouseMoveHandler = e => {
        setValues({ ...values, error: '', message: ''})
	}
	
	return (
		<>
			<NavBar/>
			<div className="container pt-5 col-md-6" style={{minHeight: "100vh"}}>
				<h1 className="mb-3">Reestrablecer la contraseña</h1>
				<form onSubmit={handleSubmit}>
					<p className="lead">No te preocupes. Está todo controlado. Introduce tu correo debajo.</p>
					<div className="form-floating mb-3">
						<input
							id="email"
							type="email"
							placeholder="Email"
							value={email}
							onChange={handleChange}
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							className="form-control"
							required
						/>
						<label htmlFor="email">Email</label>
					</div>
					<button type="submit" className="btn btn-primary mb-3">Enviar</button>
				</form>
				{showError()}
				{showMessage()}
			</div>
		</>
	)
}
export default ForgotPasswordPage