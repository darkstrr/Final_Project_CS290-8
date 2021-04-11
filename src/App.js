import logo from './logo.svg';
import './App.css';
import React, { useState , useRef, useEffect} from 'react';
import ListItem from './ListItem';

//Main function gets passed socket
function App(props) {
  //Socket passed into program
  const { socket } = props;
  //Username State
  const [name, setName] = useState('');
  //Room Name State
  const [room, setRoom] = useState('');
  //Client login state
  const [login, setLogin] = useState(false);
  //User list
  const[users, setUsers] = useState([])
  
  
  function Login(){
    //Set user as logged in
    setLogin(true);
    //Emit login event with username and userroom
    socket.emit('login', {userName: name, userRoom: room});
  }
  
  function UserDisplay(){
    if (login){
      return (
        <div>
          <b>Connected Users</b>
          <ul>
            {users.map((item, index) => (
              <ListItem key={index} name={item} />
            ))}
          </ul>
        </div>        
        )
    }
  }
  
  
  //Socket listeners
  useEffect(() => {
    
    socket.on('users', (data) => {
      setUsers(data);
    });
    
  }, []);
  
  //Function that determines what to render
  function render(){
    //Display if user is logged in
    if(login){
      return(
      <div>
        <p>
          Username: {name}<br/>
          Room Name: {room}
        </p>
      </div>
      );
    }
    //Display if user is not logged in.
    return (
      
      <div>
        <input type="text" placeholder="User Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Room Name" value={room} onChange={e => setRoom(e.target.value)}/>
        <button type="button" onClick={() => Login(true)}>
          Login
        </button>
      </div>
      )
    
  }
  
  //Main render return
  return(
    <div>
      {render()}
      {UserDisplay()}
    </div>
    )

}

export default App;
