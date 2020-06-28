const sql = require('mysql');
const db = sql.createConnection({
  host: 'database',
  user: 'root',
  password: 'theRootPassword',
  database: 'webAppDatabase',
});

db.connect(function (error) {
  if (error) {
    console.log('Connection error in workouts repo');
  } else console.log('Connected to db in workouts repo');
});

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
      const query = 'SELECT * FROM exercises WHERE workoutID = ?';
      const values = [id];
      console.log('Getting exercises');
      db.query(query, values, function (error, exercises) {
        if (error) {
          console.log('error getting: ', error);
          callback(['ERR_DATABASE'], null);
        } else {
          console.log('got exercises: ', exercises);
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
      const query =
        'INSERT INTO workouts (title, username, createdAt) VALUES (?, ?, ?)';
      const createdAt = getCurrentDateTime();
      const values = [model.title, model.username, createdAt];

      db.query(query, values, function (error, result) {
        if (error) {
          console.log('ErROR 1', error);
          callback(['ERR_DATABASE_WORKOUT']);
        } else {
          const q =
            'INSERT INTO exercises (exercise, timeOrWeight, sets, reps, workoutID) VALUES (?, ?, ?, ?, ?)';
          const workoutID = result.insertId;
          for (let i = 0; i < exercises.length; i++) {
            var exercise = exercises[i];
            var vals = [
              exercise.exercise,
              exercise.timeOrWeight,
              exercise.sets,
              exercise.reps,
              workoutID,
            ];
            db.query(q, vals, function (error) {
              if (error) {
                console.log('Error 2', error);
                callback(['ERR_DATABASE_EXERCISE']);
              } else if (i == exercises.length - 1) {
                callback([]);
              }
            });
          }
        }
      });
    },
  };
};

function getCurrentDateTime() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  var ss = String(today.getSeconds()).padStart(2, '0');
  var min = String(today.getMinutes()).padStart(2, '0');
  var hh = String(today.getHours() + 2).padStart(2, '0');

  today = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
  return today;
}
