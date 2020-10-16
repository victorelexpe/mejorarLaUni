import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons';
import fetch from 'isomorphic-unfetch'
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'

const addPost = ({data}) => {

    const router = useRouter()
    const [errorMsg, setErrorMsg] = useState('');
    const [succesMsg, setSuccesMsg] = useState('');

    useEffect(() => {
        // redirect to login if user is not authenticated
        if (!data) router.replace('/login');
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            title: e.currentTarget.title.value,
            description: e.currentTarget.description.value,
            creatorId: data.email
        }
        if((!body.title || !body.title.length) || (!body.description || !body.description.length)) return setErrorMsg("Todos los campos son obligatorios");

        setErrorMsg();

        const res = await fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if(res.status === 201) {
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
    let data
    if(cookies.get('token'))
        data = jwt.verify(cookies.get('token'), process.env.JWT_SECRET)
    else data = null
    return { 
      props: {
        data
      }
    }
  }

export default addPost;