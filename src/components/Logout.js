import React from 'react';
import { GoogleLogout } from 'react-google-login';

//this will configure the .env file in the application
require('dotenv').config();

//google cilent Id 
// This is to load your API keys from .env
//const clientId = process.env.Google_clientID ;
const clientId ='808887656812-1tfa2ft0pom3hfttk2ol05ua8naklelk.apps.googleusercontent.com';

function Logout() {
  const onSuccess = () => {
    console.log('Logged out Success');
    alert('Logged out Successfully ✌');
  };

   return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;