/*eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import App from './App';

test("User is able to successfully login", () => {
  render(<App />);

  const googleLoginButton  = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if button is on page
  fireEvent.click(googleLoginButton); // click the login button
  
  // Get google logout button by text
  const googleLogoutButton  = screen.getByText("Logout");
  // Logout button present which means you are logged in
  expect(googleLogoutButton).toBeInTheDocument();
});