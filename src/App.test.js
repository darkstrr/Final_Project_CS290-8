/*eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import App from './App';

test("User is able to successfully login", () => {
  render(<App />);

  const googleLoginButton  = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page
  fireEvent.click(googleLoginButton); // click the login button
  
  // Get google logout button by text
  const googleLogoutButton  = screen.getByText("Logout");
  // Logout button present which means you are logged in
  expect(googleLogoutButton).toBeInTheDocument();
});

test("Checks to see if music game can be started", () => {
  render(<App />);

  const googleLoginButton  = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page
  fireEvent.click(googleLoginButton); // click the login button
  
  // Retrieves start button
  const startGameButton = screen.getByTestId("start_game");
  // check if start button is on page
  expect(startGameButton).toBeInTheDocument();
  // click the start button
  fireEvent.click(startGameButton);
  
  const questionText = screen.getByText("Question");
  // checks to see if question text is on screen after clicking start game button
  expect(questionText).toBeInTheDocument();
});