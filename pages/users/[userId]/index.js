import React from 'react';
import Head from 'next/head';
import Error from 'next/error';
import middleware from '../../../middlewares/middleware'
import nextConnect from 'next-connect';
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import Grid from '../../../components/grid'
import Card from '../../../components/card'

export default function UserPage({ user, ideas }) {
  if (!user) return <Error statusCode={404} />;
  
  let havePost
  if(!ideas) havePost = false
  else havePost = true

  return (
    <>
      <style jsx>
        {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
          }
          button {
            margin: 0 0.25rem;
          }
          img {
            width: 10rem;
            height: auto;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
            margin-right: 1.5rem;
            background-color: #f3f3f3;
          }
          div {
            color: #777;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin-left: 0.25rem;
          }
        `}
      </style>
      <div>
          <div>
            <h2>{user._id}</h2>
          </div>
          Name
          <p>
            {user.name}
          </p>
          Email
          <p>
            {user.email}
          </p>
          {havePost ? (
          <Grid>
            { 
              ideas.map(idea => (
              <Card key={idea._id} title={idea.title} description={idea.description} />
            ))
            }
            </Grid>
          ) : ( <></>)}
      </div>
    </>
  );
}
  
export async function getServerSideProps(context) {

  const handler = nextConnect();
  handler.use(middleware);

  const cookies = new Cookies(context.req)
  let data
  if(cookies.get('token'))
      data = jwt.verify(cookies.get('token'), process.env.JWT_SECRET)
  else data = null

  let user
  let ideas
  if(!data)
    user = null
  else {
    await handler.apply(context.req, context.res);
    //user = await (await fetch(`${process.env.API_URL}/api/users/${context.params.userId}`)).json();
    user = await (await fetch(`${process.env.VERCEL_URL}/api/users/${context.params.userId}`)).json();
    ideas = await(await fetch(`${process.env.VERCEL_URL}/api/posts/${context.params.userId}`)).json()
  }
  
  return {
    props: {
      user,
      ideas
    },
  };
}
