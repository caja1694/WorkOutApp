const express = require('express')
const petHandler = require('./account-handler.js')
const jwt = require('jsonwebtoken')
const serverSecret = "sdfkjdslkfjslkfd"

console.log("IN REST APIx")

module.exports = function(container){

	const router = express.Router()

	console.log("In rest-api")
	router.get("/articles", authorization, function(request, response){
		// TODO: Extracting the payload is better put in a function
		// (preferably a middleware function).
		console.log("Request.decoded: ", request.decoded)
		console.log("idheader", idHeader)
		try {
			container.articleManager.getAllArticles(function(errors, articles){
				if(errors.length > 0){
					response.status(500).end()
				}
				else{
					response.status(200).json({articles: articles})
				}
			})

			// TODO: Better to use jwt.verify asynchronously.
			// Use payload to implement authorization...
			
		}catch(e){
			console.log("In /myworkouts got error: ", e)
			response.status(401).end()
			return
		}
		//response.status(200).json("Got to the end")
	})

	router.get('authorization', authorization, function(){
		// Get username
		console.log("Returning auth")

	})

	router.get("/pets/:id", function(request, response){
		
		const id = request.params.id
		
		petHandler.getPetById(id, function(errors, pet){
			if(0 < errors.length){
				response.status(500).end()
			}else if(!pet){
				response.status(404).end()
			}else{
				response.status(200).json(pet)
			}
		})
		
	})

	router.post("/pets", function(request, response){
		
		const name = request.body.name
		
		petHandler.createPet(name, function(errors, id){
			if(errors.includes("databaseError")){
				response.status(500).end()
			}else if(0 < errors.length){
				response.status(400).json(errors)
			}else{
				response.setHeader("Location", "/pets/"+id)
				response.status(201).end()
			}
		})
		
	})

	router.put("/pets/:id", function(request, response){
		
		const id = request.params.id
		const name = request.body.name
		
		petHandler.updatePetById(name, id, function(errors, petExists){
			if(errors.includes("databaseError")){
				response.status(500).end()
			}else if(0 < errors.length){
				response.status(400).json(errors)
			}else if(!petExists){
				response.status(404).end()
			}else{
				response.status(204).end()
			}
		})
		
	})

	router.delete("/pets/:id", function(request, response){
		
		const id = request.params.id
		
		petHandler.deletePetById(id, function(errors, petDidExist){
			if(0 < errors.length){
				response.status(500).end()
			}else if(!petDidExist){
				response.status(404).end()
			}else{
				response.status(204).end()
			}
		})
		
	})



	router.post("/sign-in", function(request, response){

		const grantType = request.body.grant_type
		console.log("In /sign-in, grant_type: ", request.body.grant_type)
		const account = {
			username: request.body.username,
			password: request.body.password
		}
		if(grantType != "password"){
			response.status(400).json({error: "unsupported_grant_type"})
			return
		}
		
		// TODO: Handle other type of errors as described at:
		// https://tools.ietf.org/html/rfc6749#section-5.2
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
				const idToken = jwt.sign({
					sub: userId,
					name: username
				}, "supersecret"
				)
				// TODO: Put user authorization info in the access token.
				// TODO: Better to use jwt.sign asynchronously.
				
				// TODO: Put user info in the id token.
				// Try to use the standard claims:
				// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims

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
	let errorModel = {
		errorMessage: null,
		statusCode: null
	}
	switch(errorCode){
		case "ERR_USERNAME_MISSING": errorModel.errorMessage = "invalid_client"; errorModel.statusCode=400; break;
		case "ERR_WRONG_PASSWORD": errorModel.errorMessage = "invalid_client"; errorModel.statusCode=400; break;
		case "ERR_DATABASE": errorModel.errorMessage = "server_error"; errorModel.statusCode=500; break;
		default: errorModel.errorMessage = "server_error"; errorModel.statusCode=500; break;
	}
	return errorModel
}