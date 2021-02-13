import isAuth from '../utils/isAuth'
import {useState, useRef} from 'react'
import Router from 'next/router'
import NavBar from '../components/navbar'

const Settings = ({user, token}) => {

    const [values, setValues] = useState({
		error: '',
		success: ''
    })
    
    const profilePicture = useRef();
    const {error, success} = values

    function handleSubmit(e){
        e.preventDefault()
        
        const formData = new FormData()
        if (profilePicture.current.files[0]) {
            formData.append('profilePicture', profilePicture.current.files[0]);
            fetch('/api/put/user/photo', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer: ${token}`
                },
                body: formData
            }).then((r) => {
                return r.json()
            }).then((data) => {
                console.log(data)
                if(data && data.error){
                    setValues({...values, error: data.error, success: ''})
                } else {
                    setValues({...values, error: '', success: data.message})
                    console.log('redireccion')
                    Router.push(`/ideas/${user.slug}`)
                }
            })
        }
    }

    const showError = () => (error ? <div className="alert alert-danger mt-3" onMouseOver={mouseMoveHandler}>{error}</div> : '')
	const showSuccess = () => (success ? <div className="alert alert-success mt-3" >{success}</div> : '')

	const mouseMoveHandler = e => {setValues({...values, error: ''})}

    return (
      <>
        <NavBar user={user}/>
        <div className="container pt-5 col-md-12 mb-5" style={{minHeight: "100vh"}}>
            <h2 className="mb-3">Editar datos</h2>
            <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                    <label htmlFor="avatar">Cambiar imagen de perfil
                        <input
                            className="form-control mt-2"
                            type="file"
                            id="avatar"
                            name="avatar"
                            accept="image/png, image/jpeg, image/jpg"
                            ref={profilePicture}
                        />
                    </label>
                </div>
                <button className="btn btn-primary" type="submit">Guardar &rarr;</button>
            </form>
            {showError()}
            {showSuccess()}
        </div>
      </>
    );
  };
  
  export async function getServerSideProps(context) {

	let auth = await isAuth(context)
	let user = auth.user
	let token = auth.token
	
	if(!token && !user) {
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

export default Settings;