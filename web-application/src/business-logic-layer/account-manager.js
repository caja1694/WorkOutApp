//const accountRepository = require('../data-access-layer/account-repository')

/*
exports.getAllAccounts = function(callback){
	accountRepository.getAllAccounts(callback)
}*/

module.exports = function({accountRepo, accountValidator}){
	return{
		getAllAccounts: function(callback){
			accountRepo.getAllAccounts(callback)
		},
		createAccount: function(account, callback){
			const errors = accountValidator.getErrorsNewAccount(account)
			if(0 < errors.length){
				callback(errors, null)
				return
			}
			accountRepo.createAccount(account, callback)
		},
		getAccountByUsername: function(username, callback){
			accountRepo.getAccountByUsername(username, callback)
		},

		getAccountForLogin: function(enteredAccount, callback){
			accountRepo.getAccountByUsername(enteredAccount.username, function(errors, accountFromDB){
				console.log("accountmanager accountfromdb: ", accountFromDB)
				if(0 < errors.length){
					console.log(errors)
					callback(errors)
				}
				else if(enteredAccount.password == accountFromDB.password){
					callback([])
				}
				else{
					callback(["ERR_WRONG_PASSWORD"])
				}
			})
		},

	}
}
