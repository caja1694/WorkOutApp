const express = require('express')

module.exports = function({myWorkoutManager}){
    const router = express.Router()


    router.get('/', function(request, response){

        const model = {
            workouts: null,
            activeUser: request.session.activeUser.username
        }
        console.log("active user: ",model.activeUser);
        
        myWorkoutManager.getWorkouts(model.activeUser, function(errors, workouts){
            if(0 < errors.length){
                console.log("Erorr when retrieving workouts: ", errors);
                response.render('my-workouts.hbs', model)
            }
            else{
                model.workouts = workouts;
                response.render('my-workouts.hbs', model)
            }
        })
        
        
    })

    return router
}