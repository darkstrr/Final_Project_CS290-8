import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import Game from "./Game";
import Chat from "./Chat";
import "../style.css";
import image from './image.png';
//This load and configure dotenv
require("dotenv").config();

//google cilent Id
const clientId = "808887656812-1tfa2ft0pom3hfttk2ol05ua8naklelk.apps.googleusercontent.com";
//const clientId = process.env.Google_ClientID;

function Login(props) {
  const { socket } = props;

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [url, setUrl] = useState("");

  const responseGoogle = (response) => {
    console.log(response);

    setName(response.profileObj.name);

    setEmail(response.profileObj.email);

    setUrl(response.profileObj.imageUrl);

    alert("Logged in successfully welcome!!!🙏 😍.");
    refreshToken(response);
  };

  //Refresh login Token
  const refreshToken = (res) => {
    // Timing to renew access token
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

    const refreshToken = async () => {
      const newAuthRes = await res.reloadAuthResponse();
      refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
      console.log("newAuthRes:", newAuthRes);

      console.log("new auth Token", newAuthRes.id_token);

      // Setup the other timer after the first one
      setTimeout(refreshToken, refreshTiming);
    };

    // Setup first refresh timer
    setTimeout(refreshToken, refreshTiming);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    alert("Failed to login. 😢 ");
  };

  function isLoggedIn() {
    if (name !== "") {
      socket.emit("login", name);
      return (
        <div>
          <Game socket={socket} username={name}/>
          <Chat />
        </div>
      );
    }
  }

  function loginButton() {
    if (name == "") {
      return (
        <GoogleLogin
          clientId={clientId}
          buttonText="Google Login"
          onSuccess={responseGoogle}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      );
    }
  }

  return (
    <div>
      <div class="topnav">
        <div>
          Music Guessing Game
          <img src={image}  height="40" width="40"/>
        </div>
        <div>Home</div>
        <div>About Us</div>
        <div>Username: {name}</div>
        <div>E-mail 📧:{email}</div>
        <img src={url} alt={name} height="40" width="40"/>
        {loginButton()}
      </div>
      
      <br/>
      <br/>
      
      <div class="Game">{isLoggedIn()}</div>

    </div>
  );
}

export default Login;
