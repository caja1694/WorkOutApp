const db = require('./db')


/*
exports.getAllAccounts = function(callback){
	
	const query = `SELECT * FROM accounts ORDER BY username`
	const values = []
	
	db.query(query, values, function(error, accounts){
		if(error){
			callback(['databaseError'], null)
		}else{
			callback([], accounts)
		}
	})
	
}
*/
module.exports = function(container){
	return {
		/*
		Retrieves all accounts ordered by username.
		Possible errors: databaseError
		Success value: The fetched accounts in an array.
		*/
		getAllAccounts: function(callback){
			const query = `SELECT * FROM accounts ORDER BY username`
			const values = []
			
			db.query(query, values, function(error, accounts){
				if(error){
					callback(['databaseError'], null)
				}else{
					callback([], accounts)
				}
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
					// TODO: Look for usernameUnique violation.
					console.log(error)
					callback(['databaseError'], null)
				}else{
					callback([], results.insertId)
				}
			})
		}
	}
}


/*
exports.getAccountByUsername = function(username, callback){
	
	const query = `SELECT * FROM accounts WHERE username = ? LIMIT 1`
	const values = [username]
	
	db.query(query, values, function(error, accounts){
		if(error){
			callback(['databaseError'], null)
		}else{
			callback([], accounts[0])
		}
	})
	
}
*/
/*
exports.createAccount = function(account, callback){
	
	const query = `INSERT INTO accounts (username, password) VALUES (?, ?)`
	const values = [account.username, account.password]
	
	db.query(query, values, function(error, results){
		if(error){
			// TODO: Look for usernameUnique violation.
			callback(['databaseError'], null)
		}else{
			callback([], results.insertId)
		}
	})
	
}*/