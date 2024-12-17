// Get elements
const workoutDate = document.getElementById('workout-date');
const workoutDuration = document.getElementById('workout-duration');
const caloriesBurned = document.getElementById('calories-burned');
const workoutNotes = document.getElementById('workout-notes');
const addWorkoutBtn = document.getElementById('add-workout');
const deleteWorkoutBtn = document.getElementById('delete-workout');
const workoutList = document.getElementById('workout-list');

const filterInput = document.getElementById('filter-input');
const filterButton = document.getElementById('filter-button');
const refreshButton = document.getElementById('refresh');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}




// Function to fetch workouts and render them on the page
function renderWorkouts() {
    fetch('/api/workouts')
        .then(response => response.json())
        .then(workouts => {
            workoutList.innerHTML = '';
            workouts.forEach(workout => {
                const li = document.createElement('li');
                li.textContent = `${workout.date}: ${workout.duration} minutes, ${workout.calories_burned} kcal burned - ${workout.notes} id - ${workout.id}`;
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



// filter

function renderFilterWorkouts(workouts) {
    workoutList.innerHTML = '';
    workouts.forEach((workout) => {
        const li = document.createElement('li');
        li.textContent = `ID: ${workout.id}, Date: ${workout.date}, Duration: ${workout.duration} mins, 
                          Calories: ${workout.calories_burned}, Notes: ${workout.notes}`;
        workoutList.appendChild(li);
    });
}

function filterWorkouts() {
    const filterValue = filterInput.value.trim().toLowerCase();

    if (filterValue) {
        fetch('/api/workouts')
            .then((response) => response.json())
            .then((workouts) => {
                const filtered = workouts.filter((workout) =>
                    workout.id.toString() === filterValue ||
                    workout.date.includes(filterValue) ||
                    workout.duration.toString() === filterValue ||
                    workout.calories_burned.toString() === filterValue
                );

                renderFilterWorkouts(filtered);

                // // Hide input box and filter button after filtering
                // filterInput.style.display = 'none';
                // filterButton.style.display = 'none';
            });
    }
}

filterButton.addEventListener('click', filterWorkouts);
refreshButton.addEventListener('click', () =>  location.reload());




// Function to edit a workout
// function editWorkout() {
//     const workoutId = prompt('Enter the ID of the workout you want to edit:');

//     if (workoutId) {
//         fetch(`/api/workouts/${workoutId}`, {
//             method: 'GET',
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     response.text().then(console.log);
//                     throw new Error('Workout not found');
//                 }
//                 return response.json();
//             })
//             .then((workout) => {
//                 // Prompt user for new details (pre-filled with existing values)
//                 const newDate = prompt('Enter new date (YYYY-MM-DD):', workout.date);
//                 const newDuration = prompt('Enter new duration (minutes):', workout.duration);
//                 const newCalories = prompt('Enter new calories burned:', workout.calories_burned);
//                 const newNotes = prompt('Enter new notes:', workout.notes);

//                 // Update the workout
//                 const updatedWorkout = {
//                     date: newDate || workout.date,
//                     duration: parseInt(newDuration) || workout.duration,
//                     calories_burned: parseInt(newCalories) || workout.calories_burned,
//                     notes: newNotes || workout.notes,
//                 };

//                 fetch(`/api/workouts/${workoutId}`, {
//                     method: 'PUT',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(updatedWorkout),
//                 })
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error('Failed to update workout');
//                     }
//                     alert('Workout updated successfully!');
//                     renderWorkouts(); // Refresh the list
//                 })
//                 .catch((err) => console.error('Error updating workout:', err));
//             })
//             .catch((err) => {
//                 alert('Error: Workout not found');
//                 console.error(err);
//             });
//     }
// }



function editWorkout() {
    const workoutId = prompt('Enter the ID of the workout to edit:');
    if (!workoutId) return alert('No ID entered.');

    const updatedDate = prompt('Enter the new date (YYYY-MM-DD):');
    const updatedDuration = prompt('Enter the new duration (in minutes):');
    const updatedCalories = prompt('Enter the new calories burned:');
    const updatedNotes = prompt('Enter new notes (optional):');

    const updatedWorkout = {
        date: updatedDate,
        duration: parseInt(updatedDuration),
        calories_burned: parseInt(updatedCalories),
        notes: updatedNotes
    };

    fetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWorkout)
    })
    .then(response => {
        if (!response.ok) {
            response.text().then(console.log);
            throw new Error('Workout not found or server error');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        location.reload() // Refresh the logs after editing
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('Failed to update workout: ' + error.message);
    });
}


const editWorkoutBtn = document.getElementById('edit-workout');
editWorkoutBtn.addEventListener('click', editWorkout);