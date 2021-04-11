import logo from './logo.svg';
import './App.css';
import React, { useState , useRef, useEffect} from 'react';

//Main function gets passed socket
function App(props) {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [login, setLogin] = useState(false)
  
  
  function render(){
    return (
      <div>
        <input type="text" placeholder="User Name"/>
        <input type="text" placeholder="Room Name"/>
        <button type="button">
          Login
        </button>
      </div>
      )
    
  }
  
  return(
    <div>
      {render()}
    </div>
    )

}

export default App;
