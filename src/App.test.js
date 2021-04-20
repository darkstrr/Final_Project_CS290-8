/*eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import App from './App';
import { mount , component , wrapper, find} from 'enzyme';
import  Logout  from './components/Logout.js';
import  Game  from './components/Game.js';


test("User is able to successfully view logout button after logging in", () => {
  render(<App />);

  // Login test button
  const googleLoginButton  = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page
  fireEvent.click(googleLoginButton); // click the login button

  // Logout test
  const wrapper = mount(<Logout />);
  // checks if logout button exists
  expect(wrapper.text()).toMatch("Logout");
});

test("Login button dissapears after user is done logging in", () => {
  render(<App />);
  
  const googleLoginButton  = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page
  fireEvent.click(googleLoginButton); // click the login button
  
  // Gets Google Login text on button
  const startElement= screen.queryByText('Google Login:');
  // checks if button does not exist after logging in
  expect(startElement).not.toBeInTheDocument();

});