import React from "react";
import "./App.css";
import "./style.css";
import io from "socket.io-client";
import Login from "./components/Login";

const socket = io(); // Connects to socket connection

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
