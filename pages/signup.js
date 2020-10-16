import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import fetch from 'isomorphic-unfetch'

const Signup = () => {
  const [signupError, setSignupError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  function handleSubmit(e) {
    e.preventDefault();
    fetch('/api/users/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.error) {
          setSignupError(data.message);
        }
        if (data && data.token) {
          //set cookie
          cookie.set('token', data.token, {expires: 2});
          Router.push('/');
        }
      });
  }
  return (
    <form onSubmit={handleSubmit}>
      <p>Sign Up</p>
      <label htmlFor="name">
        <input
          name="name"
          type="name"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br /><br />
      <label htmlFor="email">
        <input
          name="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br /><br />
      <label htmlFor="password">
        <input
          name="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>
      <br /><br />
      <input type="submit" value="Submit" />
      {signupError && <p style={{color: 'red'}}>{signupError}</p>}
    </form>
  );
};

export default Signup;
