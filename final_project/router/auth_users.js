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

regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;
  
    if (!review) {
      return res.status(400).json({ message: "Review content is required." });
    }
  
    if (!books[isbn]) {
      books[isbn] = { reviews: [] };
    }
  
    // Find if there's already a review from the same user
    const userReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
  
    if (userReviewIndex >= 0) {
      // Update existing review
      books[isbn].reviews[userReviewIndex].review = review;
      return res.status(200).json({ message: "Review updated successfully." });
    } else {
      // Add new review
      books[isbn].reviews.push({ username, review });
      return res.status(201).json({ message: "Review added successfully." });
    }
  });

  
  regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;
  
    if (!books[isbn] || books[isbn].reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this book." });
    }
  
    // Find the index of the review to delete
    const reviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
  
    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found for this user." });
    }
  
    // Remove the review
    books[isbn].reviews.splice(reviewIndex, 1);
    return res.status(200).json({ message: "Review deleted successfully." });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
