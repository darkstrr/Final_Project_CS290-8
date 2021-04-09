import React from 'react';
import { GoogleLogin } from 'react-google-login';

// refresh token
import { refreshToken } from './refreshToken';

//this will configure the .env file in the application
require('dotenv').config();

//google cilent Id 
// This is to load your API keys from .env
//const clientId = process.env.Google_clientID ;
const clientId ='808887656812-1tfa2ft0pom3hfttk2ol05ua8naklelk.apps.googleusercontent.com';
function Login() {
  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    alert(
      'Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.'
    );
    refreshToken(res);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      'Failed to login. 😢 '
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;