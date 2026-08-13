const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const BASE_URL = "http://localhost:5000";

const findBooksByAuthor = (author) => {
  const result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });

  return result;
};

const findBooksByTitle = (title) => {
  const result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });

  return result;
};

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
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const result = findBooksByAuthor(author);

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const result = findBooksByTitle(title);

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }

  return res.json(result);
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


// Task 10: Get all books using async/await + Axios
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get(BASE_URL + "/");
    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get by ISBN using async/await + Axios
public_users.get("/async/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(BASE_URL + "/isbn/" + encodeURIComponent(isbn));
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});

// Task 12: Get by Author using async/await + Axios
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(BASE_URL + "/author/" + encodeURIComponent(author));
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get by Title using async/await + Axios
public_users.get("/async/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(BASE_URL + "/title/" + encodeURIComponent(title));
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

module.exports.general = public_users;
