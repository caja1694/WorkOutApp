const express = require('express');

module.exports = function ({ myWorkoutManager }) {
  const router = express.Router();

  router.get('/', function (request, response) {
    const username = request.session.activeUser.username;

    myWorkoutManager.getAllWorkouts(username, function (errors, workouts) {
      const model = {
        workouts: workouts,
        activeUser: username,
        errors: errors,
      };
      response.render('my-workouts.hbs', model);
    });
  }),
    router.get('/singleWorkout/:id', function (request, response) {
      const model = {
        exercises: null,
        errors: null,
        activeUser: request.session.activeUser.username,
      };
      myWorkoutManager.getExercises(request.params.id, function (
        errors,
        exercises
      ) {
        if (0 < errors.length) {
          model.errors = errors;
        } else {
          model.exercises = exercises;
        }
        response.render('single-workout.hbs', model);
      });
    }),
    router.get('/create-workout', function (request, response) {
      const model = {
        activeUser: request.session.activeUser.username,
      };
      response.render('create-workout.hbs', model);
    });

  router.post('/createWorkout', function (request, response) {
    let exercises = {
      exercise: '',
      timeOrWeight: '',
      sets: '',
      reps: '',
    };

    if (typeof request.body.exercise === 'string') {
      exercises = {
        exercise: [request.body.exercise],
        timeOrWeight: [request.body.timeOrWeight],
        sets: [request.body.sets],
        reps: [request.body.reps],
      };
    } else {
      console.log('In else, r.body: ', request.body);
      exercises = {
        exercise: request.body.exercise,
        timeOrWeight: request.body.timeOrWeight,
        sets: request.body.sets,
        reps: request.body.reps,
      };
    }

    const model = {
      title: request.body.title,
      username: request.session.activeUser.username,
    };

    myWorkoutManager.createWorkout(model, exercises, function (error) {
      response.redirect('/myWorkouts');
    });
  });

  return router;
};
