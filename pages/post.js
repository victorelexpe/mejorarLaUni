import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons';
import fetch from 'isomorphic-unfetch'
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'

const addPost = ({user, universities}) => {

    const router = useRouter()
    const [errorMsg, setErrorMsg] = useState('');
    const [succesMsg, setSuccesMsg] = useState('');

    useEffect(() => {
        // redirect to login if user is not authenticated
        if (!user) router.replace('/login');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            title: e.currentTarget.title.value,
            description: e.currentTarget.description.value,
            creatorId: user._id,
            university: e.currentTarget.university.value
        }
        if((!body.title || !body.title.length) || (!body.description || !body.description.length) || (!body.university || !body.university.length)) return setErrorMsg("Todos los campos son obligatorios");

        setErrorMsg();

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if(res.status === 200) {
            setSuccesMsg("Propuesta guardada correctamente");
            setTimeout(() => {
                router.replace('/');
            }, 2000);
        } else {
            setErrorMsg(await res.text());
        }
    }

    return (
        <>
          <Head>
            <title>Nueva propuesta</title>
          </Head>
          <h2>Nueva propuesta</h2>
          {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
          {succesMsg ? <p style={{ color: 'green' }}>{succesMsg}</p> : null}
          <form onSubmit={handleSubmit}>
            <label htmlFor="text">
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Título de la propuesta"
              />
            </label>
            <br /><br />
            <label htmlFor="description">
              <textarea
                id="description"
                type="text"
                name="description"
                placeholder="Descripción de la propuesta"
                maxLength="500"
              />
            </label>
            <br /><br />
            <label htmlFor="university">
              <select name="university">
                {
                  universities.map(university => (
                    <option>{university.name}</option>
                  ))
                }
                </select>
            </label>
            <br /><br />
            <button type="submit"><FontAwesomeIcon icon={faSave} width="24"/> Guardar</button>

            
          </form>

          <style jsx global>{`
				html,
				body {
					padding: 0;
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
					Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
				}
				main {
					padding: 5rem 0;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
                }
                
                form {
                    min-width: 500px;
                    width: 75%;
                    max-width: 1000px;
                    margin: 20px 0px 0px 0px;
                }
                label {
                    padding-bottom: 10px;
                }
				* {
					box-sizing: border-box;
				}
			`}</style>
        </>
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
      //user = await(await fetch(`${process.env.API_URL}/api/users/find_user_by_email`, {
      user = await(await fetch(`${process.env.API_URL}/api/users/find_user_by_email`, {
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


  const universities = await (await fetch(`${process.env.API_URL}/api/universities`)).json();

    return { 
      props: {
        user,
        universities
      }
    }
  }

export default addPost;