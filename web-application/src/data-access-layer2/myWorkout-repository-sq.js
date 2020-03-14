const Sequelize = require('sequelize')
const db = new Sequelize('webAppDatabase2', 'root', 'theRootPassword',{
	host: 'database2',
	dialect: 'mysql'
})

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = function(container){
    return{

        getAllWorkouts: function(username, callback){
            const workoutmodel = getWorkoutTableModel()
            workoutmodel.findAll({
                where: {username: username}
            })
            .then(function(workouts){
                const workoutsToReturn = []
                for(let i = 0; i<workouts.length; i++){
                    workoutsToReturn.push(workouts[i].dataValues)
                }
                callback([], workoutsToReturn)
            })
            .catch(function(error){
                console.error("Database error getting workout", error)
                callback(["ERR_DATABASE"], null)
            })
            
        },

        getExercises: function(id, callback){
            const exerciseModel = getExerciseModel()
            exerciseModel.findAll({
                where: {workoutId: id}
            })
            .then(function(exercises){
                const exercisesToReturn = []
                for(let i = 0; i<exercises.length; i++){
                    exercisesToReturn.push(exercises[i].dataValues)
                }
                callback([], exercisesToReturn)
            })
            .catch(function(error){
                console.error("Error retreiving exercises from database", error)
                callback(["ERR_DATABASE"], null)
            })
        }
    }
}

function getWorkoutTableModel(){
    return db.define('workout', {
        title: Sequelize.TEXT,
        username: Sequelize.TEXT,
    })
}
function getExerciseModel(){
    return db.define('exercises', {
        exerciseID: {
            type: Sequelize.TEXT,
            primaryKey: true
        },
        exercise: Sequelize.TEXT,
        timeOrWeight: Sequelize.TEXT,
        sets: Sequelize.TEXT,
        reps: Sequelize.TEXT
    },{
        timestamps: false
    })
}
/*
function createWorkOutTable(){
    const 
}

function createExerciseTable(){
    const workoutTable = getWorkoutTableModel()
    const exercises = sequelize.define('exercise', {
        id: {
           type: Sequelize.INTEGER,
           primaryKey: true,
           autoIncrement: true,
           unsigned: true
        },
        name: Sequelize.TEXT,
        intensity: Sequelize.TEXT,
        sets: Sequelize.TEXT,
        reps: Sequelize.TEXT
    })
    exercises.sync()
}*/