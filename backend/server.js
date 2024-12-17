const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Connect to SQLite database (create if it doesn't exist)
const db = new sqlite3.Database(path.join(__dirname, 'database', 'fitness.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        throw err;
    }
    console.log('Connected to the SQLite database.');

    // Create the workouts table if it doesn't exist
    db.run(
        `CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            duration INTEGER NOT NULL,
            calories_burned INTEGER NOT NULL,
            notes TEXT
        )`,
        (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
                throw err;
            }
        }
    );
});

// API endpoints

// Get all workouts
app.get('/api/workouts', (req, res) => {
    const query = 'SELECT * FROM workouts';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving workouts:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add a new workout
app.post('/api/workouts', (req, res) => {
    const { date, duration, calories_burned, notes } = req.body;
    const query =
        'INSERT INTO workouts (date, duration, calories_burned, notes) VALUES (?, ?, ?, ?)';
    db.run(query, [date, duration, calories_burned, notes], function (err) {
        if (err) {
            console.error('Error adding workout:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Workout added successfully', id: this.lastID });
    });
});

// Delete a workout
app.delete('/api/workouts/:id', (req, res) => {
    const workoutId = req.params.id;
    const query = 'DELETE FROM workouts WHERE id = ?';
    db.run(query, [workoutId], function (err) {
        if (err) {
            console.error('Error deleting workout:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Workout deleted successfully', rowsAffected: this.changes });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



