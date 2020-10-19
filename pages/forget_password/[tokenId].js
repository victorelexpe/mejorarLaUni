import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import nextConnect from 'next-connect';
import Router from 'next/router';
import middleware from '../../middlewares/middleware'

const ResetPasswordTokenPage = ({tokenId, valid}) => {

    const router = useRouter()

    useEffect(() => {
        // redirect to login if user is not authenticated
        if (!valid) router.replace('/');
    }, [valid]);
  
    async function handleSubmit(event) {
    event.preventDefault();
    const body = {
      password: event.currentTarget.password.value,
      tokenId,
    };

    const res = await fetch('/api/users/password/reset', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log(res.status)
    if (res.status === 200) Router.replace('/');
  }

  return (
    <>
      <h2>Forget password</h2>
      {valid ? (
        <>
          <p>Enter your new password.</p>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                name="password"
                type="password"
                placeholder="New password"
              />
            </div>
            <br />
            <button type="submit">Set new password</button>
          </form>
        </>
      ) : (
        <p>This link may have been expired</p>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  
  const handler = nextConnect();
  handler.use(middleware);
  await handler.apply(context.req, context.res);
  const { tokenId } = context.query;

  const tokenDoc = await context.req.db.collection('tokens').findOne({
    token: tokenId,
    type: 'passwordReset',
  });

    return { 
        props: {
            tokenId, 
            valid: !!tokenDoc 
        } 
    };
}

export default ResetPasswordTokenPage;