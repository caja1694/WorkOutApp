const Sequelize = require('sequelize');
const db = new Sequelize('webAppDatabase2', 'root', 'theRootPassword', {
  host: 'database2',
  dialect: 'mysql',
});

db.authenticate()
  .then(() => {
    console.log(
      'Connection from my workout repo has been established successfully.'
    );
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = function (container) {
  return {
    /*
        Returns all workouts created the user
        Sucess value: An array of workouts
        Possible errors: Database error
    */
    getAllWorkouts: function (username, callback) {
      const workoutmodel = getWorkoutTableModel();
      workoutmodel
        .findAll({
          where: { username: username },
          order: Sequelize.literal('createdAt DESC'),
        })
        .then(function (workouts) {
          const workoutsToReturn = [];
          for (let i = 0; i < workouts.length; i++) {
            workoutsToReturn.push(workouts[i].dataValues);
          }
          callback([], workoutsToReturn);
        })
        .catch(function (error) {
          console.error('Database error getting workout', error);
          callback(['ERR_DATABASE'], null);
        });
    },
    /*
        Returns all exercises for the specified ID
        Possible errors Database error
        Sucess value: An array with the exercises
    */
    getExercises: function (id, callback) {
      const exerciseModel = getExerciseModel();
      exerciseModel
        .findAll({
          where: { workoutId: id },
        })
        .then(function (exercises) {
          const exercisesToReturn = [];
          for (let i = 0; i < exercises.length; i++) {
            exercisesToReturn.push(exercises[i].dataValues);
          }
          callback([], exercisesToReturn);
        })
        .catch(function (error) {
          callback(['ERR_DATABASE'], null);
        });
    },
    /*
        Create a new workout
        Possible errors: Database error
        Success value: The stored workout
    */
    createWorkout: function (model, exercises, callback) {
      const workoutModel = getWorkoutTableModel();
      const exerciseModel = getExerciseModel();
      workoutModel
        .create({ title: model.title, username: model.username })
        .then(function (result) {
          console.log('inside repo: created wrkout', result.id);
          const errors = [];

          for (let i = 0; i < exercises.length; i++) {
            exerciseModel
              .create({
                exercise: exercises[i].exercise,
                timeOrWeight: exercises[i].timeOrWeight,
                sets: exercises[i].sets,
                reps: exercises[i].reps,
                workoutID: result.id,
              })
              .then(function (result) {
                console.log('Inside then in create workout');
              })
              .catch(function (error) {
                errors.push('ERR_DATABASE_EXERCISE');
                console.log(
                  'ERROR IN inner catch CREATE EXERCISEs REPO: ',
                  error
                );
              });
          }
          callback(errors);
        })
        .catch(function (error) {
          console.log('ERROR DATABASE WORKOUT', error);

          callback(['ERR_DATABASE_WORKOUT']);
        });
    },
  };
};

function getWorkoutTableModel() {
  return db.define('workout', {
    title: Sequelize.TEXT,
    username: Sequelize.TEXT,
  });
}
function getExerciseModel() {
  return db.define(
    'exercises',
    {
      exerciseID: {
        type: Sequelize.TEXT,
        primaryKey: true,
      },
      exercise: Sequelize.TEXT,
      timeOrWeight: Sequelize.TEXT,
      sets: Sequelize.TEXT,
      reps: Sequelize.TEXT,
      workoutID: Sequelize.INTEGER,
    },
    {
      timestamps: false,
    }
  );
}
