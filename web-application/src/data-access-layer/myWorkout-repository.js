const db = require('./db')

module.exports = function(container){
    return{
        getWorkoutsByUsername: function(username, callback){
            const query = `SELECT * FROM workouts WHERE username = ?`
            const values = [username]
            
            db.query(query, values, function(error, workouts){
                if(error){
					callback(['ERR_DATABASE'], null)
                    console.log("error in getting workouts from dB: ",error);
				}else{          
                    console.log("Retrived workouts from db: ", workouts);
					callback([], workouts)
				}
            })
        },

        getWorkoutByID: function(id, callback){
            const query = `SELECT * FROM workouts WHERE id = ?`
            const values = [id]
            
        }
    }
}
