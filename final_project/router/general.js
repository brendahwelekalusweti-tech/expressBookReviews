const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        const userExists = users.some(
            user => user.username === username
        );

        if (!userExists) {
            users.push({
                username: username,
                password: password
            });

            return res.status(200).json({
                message: "User successfully registered"
            });
        }

        return res.status(409).json({
            message: "Username already exists"
        });
    }

    return res.status(400).json({
        message: "Username and password are required"
    });
});

// Get the book list available in the shop
// Task 10: Get all books using Axios and async/await
public_users.get('/', async function (req, res) {

    try {

        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        return res.status(200).json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });

    }

});

// Get book details based on ISBN
// Task 11: Get book by ISBN using Axios
public_users.get('/isbn/:isbn', async function (req, res) {

    try {

        const isbn = req.params.isbn;

        const response = await axios.get(
            `http://localhost:5000/api/books/isbn/${isbn}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                message: "Book not found."
            });
        }

        return res.status(500).json({
            message: "Error retrieving book",
            error: error.message
        });

    }

});
  
// Get book details based on author
// Task 12: Get books by author using Axios
public_users.get('/author/:author', async function (req, res) {

    try {

        const author = req.params.author;

        const response = await axios.get(
            `http://localhost:5000/api/books/author/${encodeURIComponent(author)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                message: "No books found for this author."
            });
        }

        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });

    }

});

// Get all books based on title
// Task 13: Get books by title using Axios
public_users.get('/title/:title', async function (req, res) {

    try {

        const title = req.params.title;

        const response = await axios.get(
            `http://localhost:5000/api/books/title/${encodeURIComponent(title)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                message: "No books found with this title."
            });
        }

        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });

    }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

module.exports.general = public_users;
