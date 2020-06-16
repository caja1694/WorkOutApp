const db = require('./db');

module.exports = function (container) {
  return {
    /*
        Returns all workouts created the user
        Possible errors: Database error
        Sucess value: An array of workouts
    */
    getAllWorkouts: function (username, callback) {
      const query = `SELECT * FROM workouts WHERE username = ? ORDER BY createdAt DESC`;
      const values = [username];
      db.query(query, values, function (error, workouts) {
        if (error) {
          callback(['ERR_DATABASE'], null);
        } else {
          callback([], workouts);
        }
      });
    },

    /*
        Returns all exercises for the specified ID
        Possible errors Database error
        Sucess value: An array with the exercises
    */
    getExercises: function (id, callback) {
      const query = 'SELECT * FROM exercises WHERE id = ?';
      const values = [id];

      db.query(query, values, function (error, exercises) {
        if (error) {
          callback(['ERR_DATABASE'], null);
        } else {
          callback([], exercises);
        }
      });
    },

    /*
        Create a new workout
        Possible errors: Database error
        Success value: The stored workout
    */
    createWorkout: function (model, exercises, callback) {
      const query = 'INSERT INTO workouts (title, username) VALUES (?, ?)';
      const values = [model.title, model.username];
      db.query(query, values, function (error, result) {
        if (error) {
          console.log('ErROR 1', error);
          callback(['ERR_DATABASE_WORKOUT']);
        } else {
          const q =
            'INSERT INTO exercises (exercise, timeOrWeight, sets, reps, workoutID) VALUES (?, ?, ?, ?, ?)';
          const workoutID = result.id;
          for (exercise in exercises) {
            var vals = [
              exercise.exercise,
              exercise.timeOrWeigth,
              exercise.sets,
              exercise.reps,
              workoutID,
            ];
            db.query(q, vals, function (error) {
              if (error) {
                console.log('Error 2');
                callback(['ERR_DATABASE_EXERCISE']);
              }
            });
          }
        }
      });
    },
  };
};
