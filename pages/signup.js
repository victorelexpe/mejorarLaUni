import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import fetch from 'isomorphic-unfetch'
import NavBar from '../components/navBar'

const Signup = () => {
	const [signupError, setSignupError] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	
	function handleSubmit(e) {
		e.preventDefault();
		fetch('/api/users/create_user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				password,
			}),
		})
			.then((r) => r.json())
			.then((data) => {
				if (data && data.error) {
					setSignupError(data.message);
				}
				if (data && data.token) {
					//set cookie
					cookie.set('token', data.token, {expires: 2});
					Router.push('/');
				}
			});
	}
	return (
		<>
			<NavBar/>
			<div className="container mt-5 col-md-6">
				<h1>Regístrate</h1>
				<form onSubmit={handleSubmit}>
					
					<div className="form-floating mb-3">
						<input
							className="form-control"
							name="name"
							type="name"
							placeholder="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
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
							onChange={(e) => setEmail(e.target.value)}
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
							onChange={(e) => setPassword(e.target.value)} 
						/>
						<label htmlFor="password">Contraseña</label>
					</div>
					<button className="btn btn-primary" type="submit">Entrar! &rarr;</button>
					{signupError && <p style={{color: 'red'}}>{signupError}</p>}
				</form>
			</div>
		</>
	);
};

export default Signup;
