import NavBar from '../../components/navBar'
import isAuth from '../../utils/isAuth'
import Link from 'next/link'

const AdminIndex = ({user}) =>{

    return (
        <>
        <NavBar user={user}/>
            <div className="container pt-5 col-md-12 mb-5" style={{minHeight: "100vh"}}>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link href="/admin/universities"><a>Gestionar universidades</a></Link>
                    </li>
                    <li className="list-group-item">
                        <Link href="/admin/ideas"><a>Gestionar ideas</a></Link>
                    </li>
                    <li className="list-group-item">
                        <Link href="/admin/users"><a>Gestionar usuarios</a></Link>
                    </li>
                </ul>
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

export default AdminIndex