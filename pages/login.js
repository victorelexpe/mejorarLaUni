import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import fetch from 'isomorphic-unfetch'
import NavBar from '../components/navBar'
import Link from 'next/link'

const Login = () => {
	const [loginError, setLoginError] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		//call api
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
			console.log(r.json())
			return r.json();
		})
		.then((data) => {
			console.log(data)
			if (data && data.error) {
				setLoginError(data.message);
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
			<div className="container pt-5 col-md-6" style={{minHeight: "100vh"}}>
				{loginError && (
					<div className="container">
						<div className="alert alert-warning alert-dismissible fade show" role="alert">
							{loginError}
							<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
						</div>
					</div>
				)}
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
							onChange={(e) => setEmail(e.target.value)}
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
							onChange={(e) => setPassword(e.target.value)}
						/>
						<label htmlFor="password">Contraseña</label>
					</div>
					<button type="submit" className="btn btn-primary mb-3">Entrar</button>
				</form>
				<div className="mb-3">
					<Link href="/forgot_password">¿Has olvidado la contraseña?</Link>
				</div>
				<div>¿Aún no te has registrado? &nbsp;
					<Link href="/signup">Hazlo aquí</Link>
				</div>
			</div>
		</>
	);
};

export default Login;
