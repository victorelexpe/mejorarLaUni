import React, {useState} from 'react'
import Router from 'next/router'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import NavBar from '../components/navbar'
import Link from 'next/link'

const Login = () => {

	const [values, setValues] = useState({
		email: '',
		password: '',
		error: '',
		success: ''
	})

	const {email, password, error, success} = values

	function handleSubmit(e) {
		e.preventDefault()

		fetch('/api/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
		.then((r) => {
			return r.json()
		})
		.then((data) => {
			if (data && data.error) {
				setValues({...values, error: data.error, success: ''})
			} else if (data && data.token) {
				setValues({...values, email: '', password: '', error: '', success: 'Has iniciado sesión correctamente. Redirigiendo...'})
				cookie.set('token', data.token, {expires: 1})
				Router.push(`/ideas/${user.slug}`)
			}
		})
	}
	
	const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value, error: '', success: false})
	}

	const showError = () => (error ? <div className="alert alert-danger mt-3" onMouseOver={mouseMoveHandler}>{error}</div> : '')
	const showSuccess = () => (success ? <div className="alert alert-success mt-3" >{success}</div> : '')

	const mouseMoveHandler = e => {setValues({...values, error: ''})}
	
	return (
		<>
			<NavBar/>
			<div className="container pt-5 col-md-6" style={{minHeight: "100vh"}}>
				<h1 className="mb-3">Iniciar sesión</h1>
				<form onSubmit={handleSubmit}>
					<div className="form-floating mb-3">
						<input
							type="email"
							name="email"
							placeholder="Email"
							className="form-control"
							value={email}
							required={true}
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							onChange={handleChange('email')}
						/>
						<label htmlFor="email">Email</label>
					</div>
					<div className="form-floating mb-3">
						<input
							type="password"
							className="form-control"
							name="password"
							placeholder="password"
							value={password}
							required={true}
							onChange={handleChange('password')}
						/>
						<label htmlFor="password">Contraseña</label>
					</div>
					<button type="submit" className="btn btn-primary mb-3">Entrar</button>
				</form>
				<div className="mb-3">
					<Link href="/password/reset">¿Has olvidado la contraseña?</Link>
				</div>
				<div>¿Aún no te has registrado? &nbsp;
					<Link href="/signup">Hazlo aquí</Link>
				</div>
				{showError()}
				{showSuccess()}
			</div>
		</>
	)
}

export default Login
