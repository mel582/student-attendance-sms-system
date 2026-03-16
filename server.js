// server.js

const express = require('express');
const { Pool } = require('pg'); // Assuming PostgreSQL, adjust if using a different DB
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection pool setup
const pool = new Pool({
    user: 'your_db_user',          // replace with your database user
    host: 'localhost',             // replace with your database host
    database: 'attendance_db',     // replace with your database name
    password: 'your_db_password',  // replace with your database password
    port: 5432,                    // adjust if using a different port
});

// API routes
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/api/students', async (req, res) => {
    const { name, class, attendance } = req.body;
    try {
        const result = await pool.query('INSERT INTO students (name, class, attendance) VALUES ($1, $2, $3) RETURNING *', [name, class, attendance]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
