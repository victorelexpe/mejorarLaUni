import React, {useState} from 'react';
import Link from 'next/link'
import Router from 'next/router'
import cookie from 'js-cookie';
import fetch from 'isomorphic-unfetch'
import Message from './message'

export default function navBar({loggedIn}){

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
            return r.json();
        })
        .then((data) => {
            if (data && data.error) {
                setLoginError(data.message);
            } else setLoginError();
            if (data && data.token) {
                //set cookie
                cookie.set('token', data.token, {expires: 2});
                Router.push('/userIdeas');
            }

        });
    }

    return (
        <>
            <nav className="navbar navbar-light navbar-expand-md bg-light">
                <div className="container">
                    {loggedIn ? (
                        <Link href="/userIdeas">
                            <a className="navbar-brand me-4" style={{marginBottom: "3px"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
                                    <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
                                </svg>
                            </a>
                        </Link>
                    ) : (
                        <Link href="/">
                        <a className="navbar-brand me-4" style={{marginBottom: "3px"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
                                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
                            </svg>
                        </a>
                        </Link>
                    )}

                    <button className="navbar-toggler border-0 my-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                        {loggedIn && (
                            <ul className="navbar-nav me-auto mt-3 mt-md-0 mb-lg-0">
                                <li className="nav-item" style={{marginRight: "24px"}}>
                                    <Link href="/ideas">
                                        <a className="navbar-link fs-4 text-dark text-decoration-none">todas las ideas</a>
                                    </Link>
                                </li>
                                <li className="nav-item mb-2 mb-md-0"><hr className="dropdown-divider"/></li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger" type="submit" onClick={() => {
                                        cookie.remove('token');
                                        Router.push('/');
                                    }}>Cerrar sesión</button>
                                </li>
                            </ul>
                        )}
                        {!loggedIn && (
                            <form onSubmit={handleSubmit}>
                                <div className="row align-items-center my-auto py-3 py-md-0">
                                    <div className="col-md mb-2 mb-md-0">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            className="form-control py-3 py-md-1 rounded border-0"
                                            value={email}
                                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                            required={true}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md mb-2 mb-md-0">
                                        <input
                                            type="password"
                                            className="form-control py-3 py-md-1 rounded border-0"
                                            name="password"
                                            placeholder="Contraseña"
                                            value={password}
                                            required={true}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2 d-grid">
                                        <button type="submit" className="btn btn-primary">Entrar</button>
                                    </div>
                                </div>
					            <Link href="/forgot_password"><a style={{fontSize: "1em", textDecoration: "none"}}>¿Has olvidado la contraseña?</a></Link>
                            </form>
                        )}
                    </div>
                </div>
                <style jsx>{`
                   .navbar-toggler:focus,
                   .navbar-toggler:active,
                   .navbar-toggler-icon:focus {
                       outline: none;
                       box-shadow: none;
                   }
                `}</style>
            </nav>
            {loginError && (
                <Message show={true} msg={loginError}/>
            )}
            
            

        </>
    )
}