import Link from 'next/link'
import cookie from 'js-cookie';
import Router from 'next/router'

export default function NavBar({ loggedIn }) {
    return (

        <nav className="navbar navbar-light bg-white mb-5 mt-4">
            <div className="container">
                <Link href="/">
                    <a className="navbar-brand fs-4 fw-bold text-primary">Inicio 🏠</a>
                </Link>
                <div className="d-flex">
                    {loggedIn ? (
                        <button className="btn btn-primary btn-sm" type="submit" onClick={() => {
                            cookie.remove('token');
                            Router.push('/');
                        }}>Cerrar sesión</button>
                    ) : (
                    <>
                    </>)
                    }
                </div>
            </div>
        </nav>
        
    )
}