import React, {useState, useEffect, useRef} from "react";

export default function Timer() {
  const [timer, setTimer] = useState(45);
  const id = useRef(null);
  const clear = () => {
    window.clearInterval(id.current);
  };
  useEffect(() => {
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
    return () => clear();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      clear();
      setTimer("Time Up!!!");
    }
  }, [timer]);

  return (
    <div className="App">
      <div>Time left : {timer} </div>
    </div>
  );
}
