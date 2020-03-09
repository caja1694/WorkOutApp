const express = require('express')
console.log("In account router")

module.exports = function({accountManager}){

	const router = express.Router()

	// Render sign up page
	router.get("/sign-up", function(request, response){
		response.render("accounts-sign-up.hbs")
	})

	// Render sign in page
	router.get("/sign-in", function(request, response){
		response.render("accounts-sign-in.hbs")
	})

	router.get("/sign-out", function(request, response){
		console.log("Destroying session")
		request.session.destroy(function(error){
			console.log(error)
		})
		response.redirect("/")
	})

	// Get all accounts
	router.get("/", function(request, response){
		accountManager.getAllAccounts(function(errors, accounts){
			console.log(errors, accounts)
			const model = {
				errors: errors,
				accounts: accounts
			}
			response.render("accounts-list-all.hbs", model)
		})
	})
	// Get account
	router.get('/:username', function(request, response){
		
		const username = request.params.username
		
		accountManager.getAccountByUsername(username, function(errors, account){
			const model = {
				errors: errors,
				account: account
			}
			response.render("accounts-show-one.hbs", model)
		})
		
	})

	// Create account
	router.post('/sign-up', function(request, response){
		const account = {
			username: request.body.username,
			email: request.body.email,
			password: request.body.password
		}
		accountManager.createAccount(account, function(errors){
			if(0 < errors.length){
				const error = {
					error: errors[0]
				}
				response.render('accounts-sign-up.hbs', error)
			}
			else{
				response.redirect('/accounts/sign-in')
			}
		})
		
	})
	router.post('/sign-in', function(request, response){
		const account = {
			username: request.body.username,
			password: request.body.password
		}
		accountManager.getAccountForLogin(account, function(errors){
			if(0 < errors.length){
				const error = {
					error: errors[0]
				}
				response.render('accounts-sign-in.hbs')
			}
			else{
				request.session.activeUser = {username: account.username}
				response.redirect('/')
			}
		})
	})

	
	return router

}