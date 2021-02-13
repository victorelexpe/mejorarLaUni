import React, {useState} from 'react'
import NavBar from '../components/navbar'
import {createUser} from '../actions/users'

const Signup = () => {
	
	const [values, setValues] = useState({
		name: '',
		email: '',
		password: '',
		error: '',
		success: ''
	})

	const {name, email, password, error, success} = values
	
	function handleSubmit(e) {
		e.preventDefault()
		createUser({name, email, password}).then((data) => {
			if (data && data.error) {
				setValues({...values, error: data.error, success: ''})
			} else{
				setValues({...values, name: '', email: '', password: '', error: '', success: 'Te has registrado correctamente. Por favor, inicia sesión'})
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
				<h1 className="mb-3">Regístrate</h1>
				<form onSubmit={handleSubmit}>
					
					<div className="form-floating mb-3">
						<input
							className="form-control"
							name="name"
							type="name"
							placeholder="name"
							value={name}
							required={true}
							onChange={handleChange('name')}
						/>
						<label htmlFor="name">Nombre de usuario</label>
					</div>
					<div className="form-floating mb-3">
						<input
							className="form-control"
							name="email"
							type="email"
							placeholder="email"
							value={email}
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							required={true}
							onChange={handleChange('email')}
						/>
						<label htmlFor="email">Email</label>
					</div>
					<div className="form-floating mb-3">
						<input
							className="form-control"
							name="password"
							type="password"
							placeholder="password"
							value={password}
							required={true}
							onChange={handleChange('password')}
						/>
						<label htmlFor="password">Contraseña</label>
					</div>
					<button className="btn btn-primary" type="submit">Entrar! &rarr;</button>
					{showError()}
					{showSuccess()}
				</form>
			</div>
		</>
	)
}

export default Signup
