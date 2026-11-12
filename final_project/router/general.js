const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!users.some(user => user.username === username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Obtener la lista de todos los libros disponibles en la tienda
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Obtener los detalles de un libro basado en el ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});
  
// Obtener los detalles de los libros basados en el autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let booksKeys = Object.keys(books);
  
  booksKeys.forEach((isbn) => {
    if (books[isbn].author === author) {
      booksByAuthor.push({
        "isbn": isbn,
        "title": books[isbn].title,
        "reviews": books[isbn].reviews
      });
    }
  });

  return res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Obtener todos los libros basados en el título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  let booksKeys = Object.keys(books);

  booksKeys.forEach((isbn) => {
    if (books[isbn].title === title) {
      booksByTitle.push({
        "isbn": isbn,
        "author": books[isbn].author,
        "reviews": books[isbn].reviews
      });
    }
  });

  return res.send(JSON.stringify(booksByTitle, null, 4));
});

// Obtener la reseña de un libro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;