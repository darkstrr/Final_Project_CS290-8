import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "./style.css";
import io from "socket.io-client";
import Login from "./components/Login";
import Logout from "./components/Logout";

const socket = io(); // Connects to socket connection

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <Login socket={socket} />
      <br />

      <br />

      <br />
      <br />

      <div className="footer">
        <p>
          Developed by Akshay Patel, Albert Wang, Marco Paparatto, Shayed Ahmed
        </p>
      </div>
=======
      <Login socket={socket}/>
      <br/>
      <br/>
      
          
          <div className="footer">
            <p>
               Developed by Akshay Patel, Albert Wang, Marco Paparatto, Shayed Ahmed
            </p>
          </div>
     
>>>>>>> b9771fcbefa339e845370e8a30720e20d39cd21d
    </div>
  );
}

export default App;
