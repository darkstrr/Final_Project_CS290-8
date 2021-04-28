import { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import Timer from "./Timer.js";

function Game(props) {
  const { socket } = props;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState(false);
  //const [tracks, setTracks] = useState([]);
  const [questions, setQuestions] = useState([]);

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
    });

    socket.on("time", (data) => {
      TimeOut(data);
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
      socket.emit("nextquestion");
    } else {
      setShowScore(true);
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
        </div>
      );
  }

  return (
    <div className="Game">
      <br />
      <div className="start">
        <button type="button" onClick={() => RestartGame(true)}>
          Start Game
        </button>
      </div>
      <br />
      {Display()}
      <br />
    </div>
  );
}

export default Game;
