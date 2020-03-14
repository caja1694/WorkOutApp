module.exports = function({myWorkoutRepo}){
    return{
        getAllWorkouts: function(username, callback){
            myWorkoutRepo.getAllWorkouts(username, callback)
        },
        getExercises: function(id, callback){
            myWorkoutRepo.getExercises(id, callback)
        }

    }
}