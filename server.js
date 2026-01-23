const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allowing inline scripts/styles for this simple portfolio if needed, but primarily for serving static content
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;
    db.run(sql, [name, email, message], function(err) {
        if (err) {
            console.error('Error saving message:', err.message);
            return res.status(500).json({ error: 'Server error saving message.' });
        }
        
        // TODO: Integrate Nodemailer here for email notification
        console.log(`New message from ${name} (${email}): ${message}`);

        res.status(201).json({ message: 'Message sent successfully!', id: this.lastID });
    });
});

// Serve index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
