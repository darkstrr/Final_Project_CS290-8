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
  
  //Function when user clicks 'login'
  function Login(){
    //Set user as logged in
    setLogin(true);
    //Emit login event with username and userroom
    socket.emit('login', {userName: name, userRoom: room});
  }
  
  //Function to display the current users
  function UserDisplay(){
    //Make sure the user is logged in first
    if (login){
      //Calls listitem to create a list from an array, code provided by prof.
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
  
  //If the user clicks "logout"
  function Leave(condition = true){
    //Set all values to deafult
    setLogin(false);
    setName('');
    setRoom('');
    setUsers('');
    //Emit logout to the server
    socket.emit('logout')
  }
  
  
  //Socket listeners
  useEffect(() => {
    //Send the userlist to everyone
    socket.on('users', (data) => {
      setUsers(data);
    });
    
  }, []);
  
  //Function that determines what to render
  function render(){
    //Display if user is logged in
    if(login){
      //Display room if the user is logged in
      return(
      <div>
        <p>
          Username: {name}<br/>
          Room Name: {room}<br/>
          <button type="button" onClick={() => Leave(false)}>
          Logout
          </button>
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
