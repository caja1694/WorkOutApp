module.exports = function({myWorkoutRepo}){
    return{
        getAllWorkouts: function(username, callback){
            myWorkoutRepo.getAllWorkouts(username, callback)
        },
        getExercises: function(id, callback){
            myWorkoutRepo.getExercises(id, callback)
        },
        createWorkout: function(model, exercises, callback){
            console.log("inside create workout manager",exercises.exercise.length);
            console.log("model:", model);
            const exercisesToSave = []

            for(let i = 0; i < exercises.exercise.length; i++){
                console.log("inside create workout manager loop");
                

                let exercise = { 
                exercise: exercises.exercise[i],
                timeOrWeight: exercises.timeOrWeight[i],
                sets: exercises.sets[i],
                reps: exercises.reps[i]
            }
            exercisesToSave.push(exercise)
            console.log("in bsns: ", exercisesToSave);
            }

            myWorkoutRepo.createWorkout(model, exercisesToSave, callback)
        }
    }
}