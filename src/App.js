import React, { useState , useRef, useEffect} from 'react';
import './App.css';
import './style.css';
import io from 'socket.io-client';
import Login from './components/Login';
import Logout from './components/Logout';

const socket = io(); // Connects to socket connection

function App() {
  const questions = [
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
		
	];

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);

	const handleAnswerOptionClick = (isCorrect) => {
		if (isCorrect) {
			setScore(score + 1);
		}

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
	};
  
  return (
    <div className="App">
      <Login socket={socket}/>
      <br />
      

      
          <br />
          
          

          <br/>
          <br/>
          
          <div className="footer">
            <p>
               Developed by Akshay Patel, Albert Wang, Marco Paparatto, Shayed Ahmed
            </p>
          </div>
     
    </div>
  );
}

export default App;
