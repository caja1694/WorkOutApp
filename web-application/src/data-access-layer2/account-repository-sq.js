const db = require('../data-access-layer2/db2')

const Sequelize = require('sequelize')
const sequelize = new Sequelize('webAppDatabase2', 'root', 'theRootPassword',{
	host: 'database2',
	dialect: 'mysql'
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = function(container){
	return {
		/*
		Retrieves all accounts ordered by username.
		Possible errors: databaseError
		Success value: The fetched accounts in an array.
        */
        getAllAccounts: function(callback){
            const account = sequelize.define('account', {
                username: Sequelize.TEXT,
                email: Sequelize.TEXT,
                password: Sequelize.TEXT
            })
            account.findAll().
            then(function(accounts){
				console.log(accounts.length)
                callback([], [accounts[0].dataValues])
            }).
            catch(function(error){
				console.error(error);
                callback(['databaseError'], null)
            })
        },

		/*
		Retrieves the account with the given username.
		Possible errors: databaseError
		Success value: The fetched account, or null if no account has that username.
		*/
		getAccountByUsername: function(username, callback){
			const query = `SELECT * FROM accounts WHERE username = ? LIMIT 1`
			const values = [username]
			
			db.query(query, values, function(error, accounts){
				if(error){
					callback(['databaseError'], null)
				}
				else if(accounts.length == 0){
					callback(["No account with that username"], null)
				}
				else{
					console.log("In else: ", accounts[0])
					callback([], accounts[0])
				}
			})
		},
		/*
		Creates a new account.
		account: {username: "The username", password: "The password"}
		Possible errors: databaseError, usernameTaken
		Success value: The id of the new account.
		*/
		createAccount: function(account, callback){
			const query = `INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)`
			const values = [account.username, account.email, account.password]
			
			db.query(query, values, function(error, results){
				if(error){
					if(error.code == 'ER_DUP_ENTRY'){
						callback(["Username is already taken"], null)
					}
					else{
						console.log(error)
						callback(['databaseError'], null)
					}
				}else{
					callback([], results.insertId)
				}
			})
		}
	}
}

