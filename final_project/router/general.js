const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// URL for fetching books from the local server
const BOOKS_API_URL = 'http://localhost:5000/books';

// Get the book list available in the shop using async-await with Axios
public_users.get('/', async (req, res) => {
  try {
    // Fetch book list from the API
    const response = await axios.get(BOOKS_API_URL);
    const bookList = response.data;
    
    // Update local books data if needed
    books = bookList;
    
    res.json(books);
  } catch (error) {
    console.error('Error fetching book list:', error);
    res.status(500).json({ message: 'Failed to fetch book list' });
  }
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    // Fetch book details from the API
    const response = await axios.get(`${BOOKS_API_URL}/${isbn}`);
    const bookDetails = response.data;

    if (bookDetails) {
      return res.status(200).json(bookDetails);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error('Error fetching book details:', error);
    return res.status(500).json({ message: 'Failed to fetch book details' });
  }
});

public_users.get('/author/:author', async (req, res) => {
    const authorName = req.params.author;
    try {
      // Fetch books by author from the API
      const response = await axios.get(`${BOOKS_API_URL}?author=${authorName}`);
      const booksByAuthor = response.data;
  
      if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
      } else {
        return res.status(404).json({ message: "No books found for this author" });
      }
    } catch (error) {
      console.error('Error fetching books by author:', error);
      return res.status(500).json({ message: 'Failed to fetch books by author' });
    }
  });

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
      // Fetch books by title from the API
      const response = await axios.get(`${BOOKS_API_URL}?title=${title}`);
      const booksByTitle = response.data;
  
      if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
    } catch (error) {
      console.error('Error fetching books by title:', error);
      return res.status(500).json({ message: 'Failed to fetch books by title' });
    }
  });
module.exports.general = public_users;
