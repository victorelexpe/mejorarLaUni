import NavBar from '../../../components/navBar'
import isAuth from '../../../utils/isAuth'
import { useEffect, useState } from 'react'
import {createUser, getUsers, deleteUser} from '../../../actions/users'

const AdminUsers = ({user, token}) => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        users: [],
        error: '',
        message: '',
        reload: false
    })

    const {name, email, password, users, error, message, reload} = values

    useEffect(() => {
        loadUsers()
    }, [reload])

    function loadUsers() {
		getUsers(token).then((data) => {
            if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			}else {
                setValues({...values, users: data})
            }
        })
    }

    const showUsers = () => {
        return users.map((u, i) => {
            return (
                <div className="col-md mb-2" key={i}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{u.name}</h5>
                            <h6 className="card-subtitle mb-3 text-muted">{u.email}</h6>
                            { u.role == 1 ? (
                                <p className=" card-text mb-0">Administrador</p>
                            ) : (
                                <p className=" card-text mb-0">Usuario</p>
                            )}
                            <button
                                onClick={() => deleteConfirm(u.email)}
                                title="Click to delete"
                                className="btn btn-close position-absolute top-0 end-0">
                            </button>
                        </div>
                    </div>
                </div>
            )
        })        
    }

    function removeUser(email) {
        deleteUser(email, token).then((data) => {
            if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			}else {
                setValues({...values, name: '', email: '', password: '', error: '', message: data.message, reload: !reload})
            }
        })
    }
    
    const deleteConfirm = email => {
        let answer = window.confirm('Are you sure you want to delete this user?')
        if (answer) {
            removeUser(email)
        }
    }

	const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value, error: ''})
    }

    const handleSubmit = e => {
        e.preventDefault()
        createUser({name, email, password}).then((data) => {
            if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			}else {
                setValues({...values, name: '', email: '', password: '',  error: '', message: data.message, reload: !reload})
            }
        })
    }

    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '')
    const showMessage = () => (message ? <div className="alert alert-success">{message}</div> : '')
    const mouseMoveHandler = e => {
        setValues({ ...values, error: '', message: ''})
    }

    return (
        <>
            <NavBar user={user}/>
            <div className="container pt-5 col-md-12 mb-5" style={{minHeight: "100vh"}}>
            <h2 className="mb-3">Crear usuarios</h2>
				<form onSubmit={handleSubmit} onMouseOver={mouseMoveHandler} className="mb-3">
					<div className="form-floating mb-3">
						<input
							className="form-control"
							name="name"
							type="name"
							placeholder="name"
							value={name}
							required
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
							required
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
							required
							onChange={handleChange('password')}
						/>
						<label htmlFor="password">Contraseña</label>
					</div>
					<button className="btn btn-primary" type="submit">Crear</button>
                </form>
                {showError()}
                {showMessage()}
                <h2 className="mb-3 mt-5">Listado y borrado de usuarios</h2>
                {showUsers()}
            </div>
        </>
    )
}

export async function getServerSideProps(context) {

    let auth = await isAuth(context)
    
    let user = auth.user
    let token = auth.token

    if(token && user) {
        if(user.role == 0){
            context.res.writeHead(302, { Location: `/ideas/${user.slug}` })
            context.res.end()
        }
    } else {
        user = null
        token = null
        context.res.writeHead(302, { Location: '/' })
        context.res.end()
    }

	return { 
		props: {
            user,
            token
		}
	}
}

export default AdminUsers
