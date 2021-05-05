import React, { useState, useEffect, useRef } from "react";

export default function Timer(props) {
  const { socket } = props;
  const { question } = props;
  const [timer, setTimer] = useState(45);
  const [showTime, setShowTime] = useState(true);
  const id = useRef(null);
  const clear = () => {
    window.clearInterval(id.current);
  };
  useEffect(() => {
    if (timer !== "Game End") {
      id.current = window.setInterval(() => {
        setTimer((time) => time - 1);
      }, 1000);
    }
    return () => clear();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      //clear();
      setTimer("Time Up!!!");
      setTimer(45);
      socket.emit("timeup", question);
    }

    socket.on("nextquestion", (data) => {
      setTimer(45);
    });

    socket.on("gameend", (data) => {
      setTimer("Game Over");
      setShowTime(false);
    });

    socket.on("tracks", (data) => {
      setTimer(45);
      setShowTime(true);
    });
  });

  return (
    <div className="App">
      {showTime ? (
        <div>Time left : {timer} </div>
      ) : (
        <div>Time left : Game Over </div>
      )}
    </div>
  );
}
