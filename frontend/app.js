// Get elements
const workoutDate = document.getElementById('workout-date');
const workoutDuration = document.getElementById('workout-duration');
const caloriesBurned = document.getElementById('calories-burned');
const workoutNotes = document.getElementById('workout-notes');
const addWorkoutBtn = document.getElementById('add-workout');
const deleteWorkoutBtn = document.getElementById('delete-workout');
const workoutList = document.getElementById('workout-list');

// Function to fetch workouts and render them on the page
function renderWorkouts() {
    fetch('/api/workouts')
        .then(response => response.json())
        .then(workouts => {
            workoutList.innerHTML = '';
            workouts.forEach(workout => {
                const li = document.createElement('li');
                li.textContent = `${workout.date}: ${workout.duration} minutes, ${workout.calories_burned} kcal burned - ${workout.notes}`;
                workoutList.appendChild(li);
            });
        })
        .catch(err => console.error('Error fetching workouts:', err));
}

// Function to add a workout
addWorkoutBtn.addEventListener('click', () => {
    const newWorkout = {
        date: workoutDate.value,
        duration: parseInt(workoutDuration.value),
        calories_burned: parseInt(caloriesBurned.value),
        notes: workoutNotes.value
    };

    fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkout)
    })
    .then(() => {
        renderWorkouts(); // Update the workout list after adding
        workoutDate.value = '';
        workoutDuration.value = '';
        caloriesBurned.value = '';
        workoutNotes.value = '';
    })
    .catch(err => console.error('Error adding workout:', err));
});

// Function to delete a workout (currently just an example; you might want to refine it)
deleteWorkoutBtn.addEventListener('click', () => {
    // Implement deletion logic here (e.g., select workout by ID or date)
    const workoutId = prompt('Enter the ID of the workout to delete:');
    
    fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
    })
    .then(() => renderWorkouts()) // Refresh the list after deletion
    .catch(err => console.error('Error deleting workout:', err));
});

// Initial render
window.onload = () => {
    renderWorkouts();
};
