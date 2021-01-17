import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import nextConnect from 'next-connect';
import Router from 'next/router';
import middleware from '../../middlewares/middleware'

import NavBar from '../../components/navBar'

const ResetPasswordTokenPage = ({tokenId, valid}) => {

		const router = useRouter()

		useEffect(() => {
				// redirect to login if user is not authenticated
				if (!valid) router.replace('/');
		}, [valid]);
	
		async function handleSubmit(event) {
		event.preventDefault();
		const body = {
			password: event.currentTarget.password.value,
			tokenId,
		};

		const res = await fetch('/api/users/password/reset', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		console.log(res.status)
		if (res.status === 200) Router.replace('/');
	}

	return (
		<>
			<NavBar/>
			<div className="container mt-5 col-md-6">
				<h1>Reestrablecer la contraseña</h1>
				{valid ? (
					<>
						<p className="lead">Introduce tu nueva contraseña.</p>
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									name="password"
									type="password"
									placeholder="Nueva contraseña"
									className="form-control"
								/>
								<label htmlFor="password">Nueva contraseña</label>
							</div>
							<button type="submit" className="btn btn-primary mb-3">Confirmar</button>
						</form>
					</>
				) : (
					<p className="lead">Este enlace puede que haya expirado</p>
				)}
			</div>
		</>
	);
};

export async function getServerSideProps(context) {
	
	const handler = nextConnect();
	handler.use(middleware);
	await handler.apply(context.req, context.res);
	const { tokenId } = context.query;

	const tokenDoc = await context.req.db.collection('tokens').findOne({
		token: tokenId,
		type: 'passwordReset',
	});

		return { 
				props: {
						tokenId, 
						valid: !!tokenDoc 
				} 
		};
}

export default ResetPasswordTokenPage;