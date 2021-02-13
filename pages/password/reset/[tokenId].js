import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import nextConnect from 'next-connect'
import Router from 'next/router'
import database from '../../../middlewares/database'
import NavBar from '../../../components/navbar'

const ResetPasswordTokenPage = ({tokenId, valid}) => {

		const router = useRouter()

		useEffect(() => {
			if (!valid) router.replace('/')
		}, [valid])

		const [values, setValues] = useState({
			password: '',
			error: '',
			message: ''
		})

		const {password, error, message} = values
	
		async function handleSubmit(event) {
			event.preventDefault()

		fetch('/api/put/password', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				password,
				tokenId
			})
		})
		.then((r) => {
			return r.json()
		})
		.then((data) => {
			if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			}else {
                setValues({...values, password: '', error: '', message: data.message})
				Router.replace('/')
			}	
		})
	}

	const handleChange = e => {
        setValues({ ...values, password: e.target.value, error: ''})
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
				{valid ? (
					<>
						<p className="lead">Introduce tu nueva contraseña.</p>
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									name="password"
									type="password"
									value={password}
									onChange={handleChange}
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
			{showError()}
			{showMessage()}
		</>
	)
}

export async function getServerSideProps(context) {
	
	const handler = nextConnect()
	handler.use(database)
	await handler.apply(context.req, context.res)
	const { tokenId } = context.query

	const tokenDoc = await context.req.db.collection('tokens').findOne({
		token: tokenId,
		type: 'passwordReset',
	})

	return { 
		props: {
			tokenId, 
			valid: !!tokenDoc 
		} 
	}
}

export default ResetPasswordTokenPage