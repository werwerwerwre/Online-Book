const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Paths
const filePath = path.join(__dirname, 'votes.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Routes
app.get('/api/books', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading books file' });
        }
        const books = JSON.parse(data || '[]');
        res.json(books);
    });
});

app.post('/api/books', (req, res) => {
    const { title, author, description } = req.body;

    if (!title || !author || !description) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading books file' });
        }

        const books = JSON.parse(data || '[]');
        books.push({ title, author, description });

        fs.writeFile(filePath, JSON.stringify(books, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ message: 'Error saving book' });
            }
            res.status(201).json({ message: 'Book added' });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
