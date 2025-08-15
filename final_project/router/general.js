const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

    if(username && password){
        if(isValid(username)){
          users.push({"username": username, "password": password});
          res.status(200).json({message: `User ${username} was successfully created`});
        }else{
          res.status(404).json({message: "User already registred"});
        }
    }else{
      res.status(404).json({message: "Some credentials where not provided"});
    }
});

public_users.get("/users", (req,res) => {
    res.send(users);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(books);  
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(isbn){
      res.send(JSON.stringify(books[isbn]));
    }
    else{
      res.send("Invalid ISBN");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filteredKeys = Object.keys(books).filter(i => books[`${i}`].author.toLowerCase() === author.toLowerCase());
    const filteredBooks = new Map();
    filteredKeys.forEach(k => {filteredBooks.set(k, books[k])});
    res.json(Object.fromEntries(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const filteredKeys = Object.keys(books).filter(i => books[`${i}`].title.toLowerCase() === title.toLowerCase());
  const filteredBooks = new Map();
  filteredKeys.forEach(k => {filteredBooks.set(k, books[k])});
  res.json(Object.fromEntries(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  if(ISBN){
    const book = books[ISBN];
    if(book){
      res.send(book.reviews);
    }else{
      res.send(`No book with ISBN ${ISBN} was found`);
    }
  }else{
    res.send(`The ISBN is not valid`);
  }
});

// Async/Await functions
// =====================

// Get all books
const getAllBooks = async () =>{
  const books =await axios.get("http://localhost:5001/"); 
  console.log(books);
};

// Get books by author
const getBooksByAuthor = async (author) =>{
  const books =await axios.get("http://localhost:5001/author/"+author.replace(" ", "%20")); 
  console.log(books);
};

// Get book by title
const getBooksByTitle = async (author) =>{
  const books =await axios.get("http://localhost:5001/title/"+author.replace(" ", "%20")); 
  console.log(books);
};

// Get book by ISBN
const getBookISBN = async (isbn) =>{
  const books =await axios.get("http://localhost:5001/isbn/"+isbn); 
  console.log(books);
};

module.exports.general = public_users;
