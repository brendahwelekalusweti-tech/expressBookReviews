const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Secret key must match the one in your server.js
const SECRET_KEY = "fingerprint_customer";

// Check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if username and password match
const authenticatedUser = (username, password) => {
    return users.some(
        user => user.username === username &&
                user.password === password
    );
};


// TASK 7: Login as a registered user
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
    }

    // Generate JWT token
    const token = jwt.sign(
        { username: username },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    return res.status(200).json({
        message: "User successfully logged in.",
        token: token
    });

});


// TASK 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user.username;
    const review = req.query.review;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found."
        });
    }

    // Check if review was provided
    if (!review) {
        return res.status(400).json({
            message: "Review is required."
        });
    }

    // Create reviews object if it does not exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the user's review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added or updated successfully.",
        reviews: books[isbn].reviews
    });

});


// TASK 9: Delete a user's own book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found."
        });
    }

    // Check if the user has a review
    if (!books[isbn].reviews ||
        !books[isbn].reviews[username]) {

        return res.status(404).json({
            message: "You have not reviewed this book."
        });
    }

    // Delete only this user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Your review has been deleted successfully."
    });

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;