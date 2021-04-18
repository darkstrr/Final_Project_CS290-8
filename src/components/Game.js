import React, { useState, useRef, useEffect } from "react";
import Logout from "./Logout";

function Game(props) {
  const { socket } = props;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [questions, setQuestions] = useState([]);

  function RestartGame(condition = true) {
    socket.emit("start");
  }

  useEffect(() => {
    socket.on("tracks", (data) => {
      setQuestions(data);
      setGameState(true);
    });
  }, []);
  /*     const questions = [
    {
			questionText: 'Who is your Professor for CS490?',
			answerOptions: [
				{ answerText: 'Naman', isCorrect: true },
				{ answerText: 'Kristiana', isCorrect: false },
				{ answerText: 'David', isCorrect: false },
				{ answerText: 'NONE', isCorrect: false },
			],
		},
		{
			questionText: 'Your industry mentor is from ____ company?',
			answerOptions: [
				{ answerText: 'Facebook', isCorrect: true },
				{ answerText: 'Google', isCorrect: false },
				{ answerText: 'Instagram', isCorrect: false },
				{ answerText: 'Whatsapp', isCorrect: false },
			],
		},
    {
			questionText: 'Which programming languague is this code wriiten?',
			answerOptions: [
				{ answerText: 'Python and Javscript', isCorrect: true },
				{ answerText: 'Perl and Ruby', isCorrect: false },
				{ answerText: 'C and C++', isCorrect: false },
				{ answerText: 'JAVA and C#', isCorrect: false },
			],
		},
		{
			questionText: 'Who is CEO of Tesla?',
			answerOptions: [
				{ answerText: 'Jeff Bezos', isCorrect: false },
				{ answerText: 'Elon Musk', isCorrect: true },
				{ answerText: 'Bill Gates', isCorrect: false },
				{ answerText: 'Tony Stark', isCorrect: false },
			],
		},
		{
			questionText: 'The iPhone was created by which company?',
			answerOptions: [
				{ answerText: 'Apple', isCorrect: true },
				{ answerText: 'Intel', isCorrect: false },
				{ answerText: 'Amazon', isCorrect: false },
				{ answerText: 'Microsoft', isCorrect: false },
			],
		},
		
	]; */

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
                  <audio id="sample" controls>
                    <source
                      src={questions[currentQuestion].questionText}
                      type="audio/mpeg"
                    />
                  </audio>
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
      <div className="start" data-testid="start_game">
        <button type="button" onClick={() => RestartGame(true)}>
          Start Game
        </button>
      </div>
      <br />
      {Display()}

      <br />

      <Logout />
    </div>
  );
}

export default Game;
