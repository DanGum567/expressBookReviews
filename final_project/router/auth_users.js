const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"user", "password":"pwd"}, {"username":"user2", "password":"pwd2"}];

const isValid = (username)=>{ //returns boolean
    return !users.some(u => u["username"] === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(u => u["username"] === username && u["password"] === password);
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
      res.status(404).json({message: "Error login-in"});
    }
    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({data: password}, 'access',{ expiresIn: 60 * 60 });
        req.session.authorization = {
          accessToken, username
        };
        console.log(req.session.authorization);
        return res.status(200).json({message: `User ${username} was successfully logged in`});
    }else{
      res.status(208).json({message: "Error login. Please check credentials"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  console.log(review);
  if(isbn){
      let book = books[isbn];
      let username = req.session.authorization["username"];
      book.reviews[username] = review;
      delete books[isbn];
      books[isbn] = book;
      console.log(books[isbn]);
      res.status(200).json({message: `User ${username} successfully added review`, data: books});
  }else{
    res.status(404).json({message: "Wrong ISBN", data:books});
  }
  return res.status(300).json({message: "Yet to be implemented", data:books});
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
    const isbn = req.params.isbn;  // Book identifier
    if(isbn){
      const user = req.session.authorization["username"];
      delete books[isbn].reviews[user];
      res.status(200).json({message: `User ${user} successfully deleted added reviews`, data: books});
    }else{
      res.status(401).json({message: "Invalid ISBN", data: books});
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
