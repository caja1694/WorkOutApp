const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 10

module.exports = function(container){
	return {
		getErrorsNewAccount: function(account){
			let errors = []
			// Validate username.
			if(!account.hasOwnProperty("username")){
				errors.push("usernameMissing")
			}else if(account.username.length < MIN_USERNAME_LENGTH){
				errors.push("usernameTooShort")
			}else if(MAX_USERNAME_LENGTH < account.username.length){
				errors.push("usernameTooLong")
			}else if(account.password != account.confirmationPassword){
				errors.push("Passwords didn't match")
			}
			return errors
		}
	}
}