
import NavBar from '../../../components/navbar'
import isAuth from '../../../utils/isAuth'
import { useEffect, useState } from 'react'
import {createUniversity, getUniversities, deleteUniversity} from '../../../actions/universities'

const AdminUniversity = ({user, token}) => {

    const [values, setValues] = useState({
        name: '',
        universities: [],
        error: '',
        message: '',
        reload: false
    })

    const {name, universities, error, message, reload} = values

    useEffect(() => {
        loadUniversities()
    }, [reload])

    function loadUniversities() {
		getUniversities().then((data) => {
            if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			}else {
                
                setValues({...values, universities: data})
            }
        })
    }
    
    const showUniversities = () => {
        return universities.map((u, i) => {
            return (
                <div className="col-md mb-2" key={i}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{u.name}</h5>
                            <button
                                onClick={() => deleteConfirm(u.slug)}
                                title="Click to delete"
                                className="btn btn-close position-absolute top-0 end-0">
                            </button> 
                        </div>
                    </div>
                </div>
            )
        })        
    }

    function removeUniversity(slug) {
		
		deleteUniversity(slug, token).then((data) => {
            if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			}else {
                setValues({...values, name: '', error: '', message: data.message, reload: !reload})
            }
        })
	}

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this university?')
        if (answer) {
            removeUniversity(slug)
        }
    }

    const handleChange = e => {
        setValues({ ...values, name: e.target.value, error: ''})
    }

    const handleSubmit = e => {
        e.preventDefault()
        createUniversity(name, token).then((data) => {
            if (data && data.error) {
				setValues({...values, error: data.error, message: ''})
			}else {
                setValues({...values, name: '', error: '', message: data.message, reload: !reload})
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
            <div className="container pt-5 col-md-12 mb-5"  style={{minHeight: "100vh"}}>
            <h2 className="mb-3" >Crear universidades</h2>
                <form onSubmit={handleSubmit} onMouseMove={mouseMoveHandler} className="mb-3">
					<div className="form-floating mb-3">
						<input
							type="text"
							placeholder="Nombre de la universidad"
							className="form-control"
							value={name}
                            onChange={handleChange}
                            required
						/>
						<label htmlFor="name">Nombre de la universidad</label>
					</div>
					<button type="submit" className="btn btn-primary">Crear</button>
				</form>
                {showError()}
                {showMessage()}
                <h2 className="mb-3 mt-5">Listado y borrado de universidades</h2>
                {showUniversities()}

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

export default AdminUniversity