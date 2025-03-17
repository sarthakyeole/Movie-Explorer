require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'movieapp',
    port: 3307
  });

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL Database!");
});

// Signup Route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length > 0) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
            [username, email, hashedPassword], 
            (err, result) => {
                if (err) return res.status(500).json({ message: "Error creating user" });
                res.status(201).json({ message: "User created successfully" });
            }
        );
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(400).json({ message: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ token, username: user.username });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
