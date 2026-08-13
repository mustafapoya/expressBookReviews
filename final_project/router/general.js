const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    users.push({username, password});
    return res.status(200).json({ message: "User successfully registered." });
  }

  return res.status(409).json({message: "Username already exists."});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const result = {};

  Object.keys(books).forEach((key) => {
    if(books[key].author === author) {
      result[key] = books[key];
    }
  });

  res.json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const result = {};

  Object.keys(books).forEach((key) => {
    if(books[key].title === title) {
      result[key] = books[key];
    }
  });

  res.json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(book.reviews);
});

module.exports.general = public_users;
