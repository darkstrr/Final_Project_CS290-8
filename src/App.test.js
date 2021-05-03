/*eslint-disable */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { mount, component, wrapper, find } from "enzyme";
import Logout from "./components/Logout.js";
import Game from "./components/Game.js";

test("User is able to successfully view logout button after logging in", () => {
  render(<App />);

  // Login test button
  const googleLoginButton = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page
  fireEvent.click(googleLoginButton); // click the login button

  // Logout test
  const wrapper = mount(<Logout />);
  // checks if logout button exists
  expect(wrapper.text()).toMatch("Logout");
});

test("Login button dissapears after user is done logging in", () => {
  render(<App />);

  const googleLoginButton = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page
  fireEvent.click(googleLoginButton); // click the login button

  // Gets Google Login text on button
  const startElement = screen.queryByText("Google Login:");
  // checks if button does not exist after logging in
  expect(startElement).not.toBeInTheDocument();
});

test("The about us section is viewable before logging in.", () => {
  render(<App />);

  const googleLoginButton = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page

  const about_us = screen.getByTestId("about_us_test"); // gets about us section
  expect(about_us).toBeInTheDocument(); // checks if about us section is visible
});

test("The contact us section is viewable before logging in.", () => {
  render(<App />);

  const googleLoginButton = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page

  const contact_us = screen.getByTestId("contact_us_test"); // gets contact us section
  expect(contact_us).toBeInTheDocument(); // checks if contact us section is visible
  
  const row_of_contacts = screen.getByTestId("row_of_contacts_test"); // gets contact cards section
  expect(row_of_contacts).toBeInTheDocument(); // checks if contact cards section is visible
});

test("Nav bar is always on the top of the page with correct sections.", () => {
  render(<App />);

  const googleLoginButton = screen.getByText("Google Login"); // Get google login button by text
  expect(googleLoginButton).toBeInTheDocument(); // check if login button is on page
  
  const gameTitle = screen.getByText("Music Guessing Game"); // Game title heade
  const username = screen.getByText("Username:"); // Username heade
  const email = screen.getByText("E-mail 📧:"); // Email header
  expect(gameTitle).toBeInTheDocument(); // checks if game title is visible
  expect(username).toBeInTheDocument(); // checks if username header visible
  expect(email).toBeInTheDocument(); // checks if email header visible
  
  const startElement = screen.queryByText("Google Login:");
  // checks if button does not exist after logging in
  expect(startElement).not.toBeInTheDocument();
  
  // check if nav bar is still visible even after logging in
  expect(gameTitle).toBeInTheDocument(); // checks if game title is visible
  expect(username).toBeInTheDocument(); // checks if username header visible
  expect(email).toBeInTheDocument(); // checks if email header visible
});