import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';


//google cilent Id 
const clientId ='808887656812-1tfa2ft0pom3hfttk2ol05ua8naklelk.apps.googleusercontent.com';

function Login() {
  
  const[name,setName]= useState("");
  
  const[email,setEmail]= useState("");
  
  const[url,setUrl]= useState("");

  const responseGoogle = (response) => {
    console.log(response);
    
    setName(response.profileObj.name);
    
    setEmail(response.profileObj.email);
    
    setUrl(response.profileObj.imageUrl);
    
    
    alert(
      'Logged in successfully welcome!!!🙏 😍.'
    );
    refreshToken(response);
  };
  
  //Refresh login Token 
  const refreshToken = (res) => {
    // Timing to renew access token
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
  
    const refreshToken = async () => {
        const newAuthRes = await res.reloadAuthResponse();
        refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
        console.log('newAuthRes:', newAuthRes);
        
        console.log('new auth Token', newAuthRes.id_token);
    
        // Setup the other timer after the first one
        setTimeout(refreshToken, refreshTiming);
    };
  
    // Setup first refresh timer
    setTimeout(refreshToken, refreshTiming);
};
  
  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      'Failed to login. 😢 '
    );
  };

  return (
    <div>
      <h1>Login</h1>
      <h2>Username: {name} </h2>
      <h2>Email 📧: {email}</h2>
      <img src={url} alt={name} />
      <br/>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;