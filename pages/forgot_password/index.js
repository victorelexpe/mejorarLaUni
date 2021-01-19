import React from 'react';
import Router from 'next/router';

import NavBar from '../../components/navBar'

const ForgotPasswordPage = () => {
	async function handleSubmit(e) {
		e.preventDefault(e);

		const body = {
			email: e.currentTarget.email.value,
		};

		const res = await fetch('/api/users/password/reset', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});

		if (res.status === 200) Router.replace('/');
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
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							required={true}
							className="form-control"
						/>
						<label htmlFor="email">Email</label>
					</div>
					<button type="submit" className="btn btn-primary mb-3">Enviar</button>
				</form>
			</div>
		</>
	);
};
export default ForgotPasswordPage;