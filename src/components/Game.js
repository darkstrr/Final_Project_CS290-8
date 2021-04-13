import React, { useState, useRef, useEffect } from 'react';

function Game(props) {
      
    const { socket } = props;
    
    function RestartGame(){
        socket.emit('start')
    }
    
    return (
        <div>
            <button type="button" onClick={() => RestartGame()}>
                (Re)Start Game
            </button>
        </div>
    
    )
}

export default Game;