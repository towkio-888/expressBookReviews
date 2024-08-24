const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid (not already taken)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// Function to authenticate user
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Register new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });
  return res.status(200).json({ token });
});

// Add a book review (just an example, not fully implemented)
regd_users.put("/auth/review/:isbn", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
