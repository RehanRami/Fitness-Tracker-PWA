const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'fitness_tracker'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// API endpoints

// Get all workouts
app.get('/api/workouts', (req, res) => {
    const query = 'SELECT * FROM workouts';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new workout
app.post('/api/workouts', (req, res) => {
    const { date, duration, calories_burned, notes } = req.body;
    const query = 'INSERT INTO workouts (date, duration, calories_burned, notes) VALUES (?, ?, ?, ?)';
    db.query(query, [date, duration, calories_burned, notes], (err, result) => {
        if (err) throw err;
        res.status(201).send('Workout added successfully');
    });
});

// Delete a workout (you might need to adjust based on your UI)
app.delete('/api/workouts/:id', (req, res) => {
    const workoutId = req.params.id;
    const query = 'DELETE FROM workouts WHERE id = ?';
    db.query(query, [workoutId], (err, result) => {
        if (err) throw err;
        res.send('Workout deleted successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
