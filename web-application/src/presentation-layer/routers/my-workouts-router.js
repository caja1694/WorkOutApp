const express = require('express')

module.exports = function({myWorkoutManager}){
    const router = express.Router()

    //const workouts1 = [{id: 1, title: "One", date: "2020-03-14"}, {id: 2, title: "two", date: "2020-03-14"}, {id: 3, title: "three", date: "2020-03-14"}]
    router.get('/', function(request, response){

        myWorkoutManager.getAllWorkouts(request.session.activeUser.username, function(errors, workouts){
            
            const model = {
                workouts: workouts,
                activeUser: request.session.activeUser.username,
                errors: errors
            }
            response.render('my-workouts.hbs', model)
        })       
    }),

    router.get('/singleWorkout/:id', function(request, response){
        const model = {
            exercises: null,
            errors: null
        }
        myWorkoutManager.getExercises(request.params.id, function(errors, exercises){
            console.log("IN ROUTER: ", exercises)
            if(0 < errors.length){
                model.errors = errors
            }
            else{
                model.exercises = exercises
            }
            response.render('single-workout.hbs', model)
        })
    }),

    router.get('/create-workout', function(request, response){
        response.render('create-workout.hbs')
    })

    return router
}



/*myWorkoutManager.getWorkouts(model.activeUser, function(errors, workouts){
    if(0 < errors.length){
        console.log("Erorr when retrieving workouts: ", errors);
        response.render('my-workouts.hbs', model)
    }
    else{
        model.workouts = workouts;
        response.render('my-workouts.hbs', model)
    }
})*/