import { useState,  useEffect } from "react";
import ReactAudioPlayer from 'react-audio-player';
import Timer from './Timer.js';

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
  }

  useEffect(() => {
    socket.on("tracks", (data) => {
      setQuestions(data);
      setGameState(true);
    });
    // eslint-disable-next-line
  }, []);
  

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      document.getElementById("sample").load();
    } else {
      setShowScore(true);
    }
  };
  
  
 

  function Display() {
    if (gameState)
      return (
        <div className="quiz">
          
          <div className= 'timer'>
              <Timer />
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
                <ReactAudioPlayer id="sample"
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
