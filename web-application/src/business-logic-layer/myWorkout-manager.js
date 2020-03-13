module.exports = function({myWorkoutRepo}){
    return{
        getWorkouts: function(username, callback){
            myWorkoutRepo.getWorkouts(username, callback)
        }
    }
}