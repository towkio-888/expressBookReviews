const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookDetails = books[isbn];

  if (bookDetails) {
    return res.status(200).json(bookDetails);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === authorName);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const bookReviews = books[isbn]?.reviews; // Assuming reviews are stored within book details
  
    if (bookReviews) {
      return res.status(200).json(bookReviews);
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  });

module.exports.general = public_users;
