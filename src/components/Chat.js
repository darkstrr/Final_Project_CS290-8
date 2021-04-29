import { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import { Text } from '../ListItem.js';
import "../style.css";


const socket = io(); // Connects to socket connection

export default function Chat()
{
    //Chat messages
    const [messages, setMessages] = useState([]); // State variable, list of messages
    const inputRef = useRef(null); // Reference to <input> element
    
    function onClickButton() {
       
        if (inputRef != null) {
          const message = inputRef.current.value;
          // If your own client sends a message, we add it to the list of messages to 
          // render it on the UI.
          if (message.length == 0) {
              return;
          }
          setMessages(prevMessages => [...prevMessages, message]);
          socket.emit('chat', { message: message });
        }
    }
    
    useEffect(() => {
        socket.on('chat', (data) => {
          console.log('Chat event received!!!');
          console.log(data);
          
          // If the server sends a message (on behalf of another client), then we
          // add it to the list of messages to render it on the UI.
          setMessages(prevMessages => [...prevMessages, data.message]);
        });
    }, []);
    
    return (
        <div >
            <div className="Chat">
            
                <h2 className="chat_title">Chat</h2>
                <input ref={inputRef} placeholder="Type message..." type="text" onFocus="this.value=''"/>
                <div className = "send_chat_button">
                    <button onClick={onClickButton}>Send</button>
                </div>
                <br/>
                <div className="chat_history">
                    {messages.map((item, index) => <Text key={index} msg={item} />)}
                </div>
            </div>  
            
        </div>
        );
}