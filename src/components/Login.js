import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import Game from "./Game";
import Chat from "./Chat";
import "../style.css";
import image from '../images/image.jpg';

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
  
  const [showAbout, setAbout] = useState(true);

  const responseGoogle = (response) => {
    console.log(response);

    setName(response.profileObj.name);

    setEmail(response.profileObj.email);

    setUrl(response.profileObj.imageUrl);
    
    setAbout(false);

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
      <div className="topnav">
        <div className="game_name">
          Music Guessing Game
        </div>
        <div>Username: {name}</div>
        <div>E-mail 📧: {email}</div>
        <img src={url} alt={name} height="40" width="40" data-testid="google_pic"/>
        {loginButton()}
      </div>
      
      {showAbout ? 
      (<div>
      
      <div className="about_section" data-testid="about_us_test">
        <h1 className="about_us_header">About Us</h1>
        <img src={image} className="music_logo"/>
        <h3>Welcome to the Music Guessing Game!</h3>
        <p>
          We aim to deliver a real-time music guessing game that can be accessed from anywhere as long as you have access to a web browser. Sign in with your Google Account to identify yourselves, and then input your room code to join in with friends. The game will consist of a music preview from a random artist/genre, and 4 choices of songs. By selecting one of the choices, the player will be able to earn points based on accuracy. The player with the highest amount of points by the end of the game will be declared the winner!
        </p>
        <br/>
        <p>
          During the pandemic, many social interactions have been cut short, and one of the new ways to meet and hang out with friends is through games, specifically multiplayer games. With a music game through a browser, you can play with friends, and show off your music database by earning the most points.
        </p>
      </div>
      
      <h1 className="our_team_header" data-testid="contact_us_test">Our Team</h1>
      <div className="row" data-testid="row_of_contacts_test">
        <div className="column">
          <div className="card">
            <div className="container">
              <h2>Shayed Ahmed</h2>
              <p className="team_member_title">Developer</p>
              <p>sa2255@njit.edu</p>
              <p><button className="button"><a href="mailto:sa2255@njit.edu">Contact</a></button></p>
            </div>
          </div>
        </div>
      
        <div className="column">
          <div className="card">
            <div className="container">
              <h2>Albert Wang</h2>
              <p className="team_member_title">Developer</p>
              <p>axw2@njit.edu</p>
              <p><button className="button"><a href="mailto:axw2@njit.edu">Contact</a></button></p>
            </div>
          </div>
        </div>
      
        <div className="column">
          <div className="card">
            <div className="container">
              <h2>Akshay Patel</h2>
              <p className="team_member_title">Developer</p>
              <p>ap223@njit.edu</p>
              <p><button className="button"><a href="mailto:ap223@njit.edu">Contact</a></button></p>
            </div>
          </div>
        </div>
        
        <div className="column">
          <div className="card">
            <div className="container">
              <h2>Marco Paparatto</h2>
              <p className="team_member_title">Developer</p>
              <p>mp752@njit.edu</p>
              <p><button className="button"><a href="mailto:mp752@njit.edu">Contact</a></button></p>
            </div>
          </div>
        </div>
      </div>

    </div>)
      
      :
      
      (<div>
      <br/>
      <br/>
      
      <div className="Game">{isLoggedIn()}</div>
      </div>)}
    
    </div>
  );
}

export default Login;
