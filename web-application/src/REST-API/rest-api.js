const express = require('express')
const petHandler = require('./account-handler.js')
const jwt = require('jsonwebtoken')
const serverSecret = "sdfkjdslkfjslkfd"

module.exports = function(container){

	const router = express.Router()
	
	router.use(function(request, response, next){
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
		response.setHeader("Access-Control-Allow-Methods", "*")
		response.setHeader("Access-Control-Allow-Headers", "*")
		response.setHeader("Access-Control-Expose-Headers", "*")
		next()
	})

	router.get("/articles", function(request, response){
		try {
			container.articleManager.getAllArticles(function(errors, articles){
				if(errors.length > 0){
					response.status(500).end()
				}
				else{
					response.status(200).json({articles: articles})
				}
			})		
		}catch(e){
			console.log("In /myworkouts got error: ", e)
			response.status(401).end()
			return
		}
	})

	router.get("/articles/:id", function(request, response){
		
		const id = request.params.id
		container.articleManager.getArticleById(id, function(errors, article){
			if(0 < errors.length){
				response.status(500).end()
			}else if(!article){
				response.status(404).end()
			}else{
				response.status(200).json(article)
			}
		})
		
	})

	router.post("/articles", function(request, response){
		
		const article = {
			title: request.body.title,
			description: request.body.description,
			content: request.body.content,
			username: request.body.username
		}
		
		container.articleManager.createArticle(article, function(errors, id){
			if(errors.includes("ERR_DATABASE")){
				response.status(500).end()
			}else if(0 < errors.length){
				response.status(400).json(errors)
			}else{
				response.setHeader("Location", "/articles/"+id)
				response.status(201).end()
			}
		})
		
	})

	router.put("/articles/:id", function(request, response){
		const id = request.params.id
		const article = {
			title: request.body.title,
			description: request.body.description,
			content: request.body.content,
		}
		container.articleManager.updateArticle(article, id, function(errors, id){
			if(errors.includes("databaseError")){
				response.status(500).end()
			}else if(0 < errors.length){
				response.status(400).json(errors)
			}else{
				response.setHeader("Location", "/articles/")
				response.status(204).end()
			}
		})
		
	})

	// Delete article
	router.delete("/articles/:id", authorization, function(request, response){
		
		const id = request.params.id
		console.log("Request.decoded :", request.decoded)
		
		container.articleManager.deleteArticle(id, function(errors){
			if(0 < errors.length){
				console.log("error deleting article: ", error)
				response.status(500).end()
			}else{
				console.log("Article deleted")
				response.status(204).end()
			}
		})
		
	})
	// Create account
	router.post("/sign-up", function(request, response){
		const account = {
			username: request.body.username,
			email: request.body.email,
			password: request.body.password,
			confirmationPassword: request.body.confirmationPassword
		}
		console.log("Sign up request, got model: ", account)

		container.accountManager.createAccount(account, function(errors){
			console.log("Creating new account")
			if(0 < errors.length){
				const error = errorHandler(errors[0])
				response.status(error.statusCode).json({error: error.errorMessage})
			}
			else{
				console.log("Created new account")
				response.status(200).end()
			}
		})
	})

	// Login
	router.post("/sign-in", function(request, response){
		const grantType = request.body.grant_type
		const account = {
			username: request.body.username,
			password: request.body.password
		}
		if(grantType != "password"){
			response.status(400).json({error: "unsupported_grant_type"})
			return
		}
		container.accountManager.getAccountForLogin(account, function(errors, accountFromDb){
			console.log("In API: ", accountFromDb)
			if(0 < errors.length){
				const error = errorHandler(errors[0])
				response.status(error.statusCode).json({error: error.errorMessage})
			}
			else{
				const username = accountFromDb.username
				const userId = accountFromDb.accountId
				const payload = {id: userId, "username": username}
				const accessToken = jwt.sign(payload, serverSecret)
				const idToken = {
					sub: userId,
					name: username
				}
				console.log("Sending idToken: ", payload)
				response.status(200).json({
					access_token: accessToken,
					id_token: idToken
				})
			}
		})
	})
	return router
}


var authorization = function(request, response, next){
	try{
		console.log("Trying to authorize")
		const authorizationHeader = request.get('authorization')
		const accessToken = authorizationHeader.substr("Bearer ".length)

		const payload = jwt.verify(accessToken, serverSecret, function(error, decoded){
			if(error){
				console.log("In try/if, got error: ", error)
				response.status(401).end()
			}else{
				console.log("In try/else decoded: ", decoded)
				request.decoded = decoded
				next()
			}
		})
	}catch(error){
		console.log("In catch, error: ", error)
		response.status(400).end()
		return
	}

}

function errorHandler(errorCode){
	let message = ""
	let status = 500
	let error = {
		errorMessage: null,
		statusCode: null
	}
	switch(errorCode){
		case "ERR_USERNAME_MISSING": message = "invalid_client"; status=400; break;
		case "ERR_WRONG_PASSWORD": message = "invalid_client"; statuse=400; break;
		case "ERR_DATABASE": message = "server_error"; status=500; break;
		case "ERR_USERNAME_TO_SHORT": message = "client_error"; status=400; break;
		case "ERR_USERNAME_TO_LONG": message = "client_error"; status=400; break;
		case "ERR_PASSWORD_NO_MATCH": message = "client_error"; status=400; break;
		default: message = "server_error"; status=500; break;
	}
	error.errorMessage = message
	error.statusCode = status
	return error
}