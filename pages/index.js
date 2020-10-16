import Head from 'next/head';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import fetch from 'isomorphic-unfetch'
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'

import Emoji from '../components/emoji'
import Title from '../components/title'
import Description from '../components/description'
import Grid from '../components/grid'
import Card from '../components/card'
import Footer from '../components/footer'

function Home({ideas, user}) {

  const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data) return null;
  let loggedIn = false;
  if (data.email && user) {
    loggedIn = true;
  }

  return (
 
    <div className="container">
     {loggedIn && (
        <>
        <ul>
          <li><Link href="/users/[userId]" as={`/users/${user.name}`}><a>Profile</a></Link></li>
          <li><a tabIndex={0} role="button" onClick={() => {
              cookie.remove('token');
              revalidate();
            }}>Logout</a></li>
        </ul>
        </>
      )}
      {!loggedIn && (
        <>
        <ul>
          <li><Link href="/login"><a>Login</a></Link></li>
          <li><Link href="/signup"><a>Sign Up</a></Link></li>
        </ul>
        </>
      )}

    <Head>
      <title>¿Cómo mejorarías la uni?</title>
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👩‍🎓</text></svg>" />
    </Head>

    <main>
      <Emoji emoji="👩‍🎓" />
      <Title text="¿Cómo mejorarías la uni?" />
      <Description text="Manda cualquier cambio que podría ayudar a mejorar la enseñanza en las universidades" />
      
      {loggedIn && (
        <>
        <Link href='/post'><a>Nueva propuesta &rarr;</a></Link> 
        </>
      )}
      {!loggedIn && (
        <>
        <Link href='/login'><a>Nueva propuesta &rarr;</a></Link> 
        </>
      )}

      <Grid>
        {
          ideas.map(idea => (
            <Card key={idea._id} title={idea.title} description={idea.description} />
          ))
        }
      </Grid>
    </main>

    <Footer />

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      .container {
        min-height: 100vh;
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      main {
        padding: 5rem 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      * {
        box-sizing: border-box;
      }

      a {
        color: inherit;
        text-decoration: none;
        }
  
      a:hover {
      color: #0070f3;
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #ffff;
      }
      
      li {
        float: left;
      }
      
      li a {
        display: block;
        color: black;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
      }
    `}</style>
  </div>
  );
}

export async function getServerSideProps(context) {

  const cookies = new Cookies(context.req)
  let user
  let data
  if(cookies.get('token')){
    try{
      data = jwt.verify(cookies.get('token'), process.env.JWT_SECRET)
    }catch(e) {
      data = false
    }

    if(data){
      const email = data.email
      //user = await(await fetch(`${process.env.API_URL}/api/users/findUserByEmail`, {
      user = await(await fetch('https://mejorarlauni.com/api/users/findUserByEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
      })).json()
    }else user = null
  }else user = null
    
  //const ideas = await (await fetch(`${process.env.API_URL}/api/post`)).json();
  const ideas = await (await fetch('https://mejorarlauni.com/api/post')).json();
  return { 
    props: {
      ideas,
      user
    }
  }
}

export default Home;
