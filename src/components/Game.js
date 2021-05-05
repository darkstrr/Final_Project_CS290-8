import { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import Timer from "./Timer.js";
import Leaderboard from "./Leaderboard.js";

function Game(props) {
  const { socket, username } = props;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState(false);
  const [name, setName] = useState(props.username);
  const [leaderboard, setLeaderboard] = useState([]);
  const [room, setRoom] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [inProgress, setInProgress] = useState(false);

  function RestartGame(condition = true) {
    socket.emit("start");
    setCurrentQuestion(0);
    setScore(0);
  }

  useEffect(() => {
    socket.on("tracks", (data) => {
      setQuestions(data);
      setGameState(true);
      setShowScore(false);
      setCurrentQuestion(0);
    });

    socket.on("time", (data) => {
      TimeOut(data);
    });
    socket.on("nextquestion", (data) => {
      setCurrentQuestion(data);
    });
    socket.on("gameend", (data) => {
      setShowScore(true);
    });
    socket.on("inprogress", (data) => {
      setInProgress(true);
      setInRoom(false);
      setRoom("");
    });
    socket.on("Leaderboard", (topTen) => {
      setLeaderboard(topTen);
    });
    // eslint-disable-next-line
  }, []);

  function TimeOut(CQ) {
    console.log(questions);
    const nextQuestion = CQ + 1;
    if (nextQuestion < 5) {
      setCurrentQuestion(nextQuestion);
      document.getElementById("sample").load();
    } else {
      setShowScore(true);
      socket.emit("gameend");
    }
  }

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      document.getElementById("sample").load();
      socket.emit("nextquestion", nextQuestion);
    } else {
      setShowScore(true);
      socket.emit("Leaderboard", { name: name, score: score });
      socket.emit("gameend");
    }
  };

  function Display() {
    if (gameState)
      return (
        <div className="quiz">
          <div className="timer">
            <Timer socket={socket} question={currentQuestion} />
          </div>

          {showScore ? (
            <div className="score-section">
              You scored {score} out of {questions.length}
            </div>
          ) : (
            <>
              <div className="question-section">
                <div className="question-count">
                  <span>
                    Question {currentQuestion + 1}/{questions.length}{" "}
                  </span>
                </div>
                <div className="question-text">
                  <ReactAudioPlayer
                    id="sample"
                    src={questions[currentQuestion].questionText}
                    type="audio/mpeg"
                    autoPlay
                    controls
                  />
                </div>
              </div>

              <div className="answer-section">
                {questions[currentQuestion].answerOptions.map(
                  (answerOption) => (
                    <button
                      onClick={() =>
                        handleAnswerOptionClick(answerOption.isCorrect)
                      }
                    >
                      {answerOption.answerText}
                    </button>
                  )
                )}
              </div>
            </>
          )}
          <div className="Leaderboard">
            <Leaderboard username={name} topTen={leaderboard} />
          </div>
        </div>
      );
  }

  function RoomJoin() {
    setInRoom(true);
    setInProgress(false);
    socket.emit("join", { roomName: room });
  }

  return (
    <div className="Game">
      <br />
      {inProgress ? <p>Game is already in progress!</p> : <div />}
      <div className="start">
        {inRoom ? <p> You are in room: {room}</p> : <br />}
        {inRoom ? (
          gameState ? (
            showScore ? (
              <div>
                <button
                  className="start_game_button"
                  type="button"
                  onClick={() => RestartGame(true)}
                >
                  Restart Game
                </button>
              </div>
            ) : (
              <br />
            )
          ) : (
            <button
              className="start_game_button"
              type="button"
              onClick={() => RestartGame(true)}
            >
              Start Game
            </button>
          )
        ) : (
          <div>
            <input
              type="text"
              placeholder="Room Name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button type="button" onClick={() => RoomJoin(true)}>
              Join
            </button>
          </div>
        )}
      </div>
      <br />
      {Display()}
      <br />
    </div>
  );
}

export default Game;
