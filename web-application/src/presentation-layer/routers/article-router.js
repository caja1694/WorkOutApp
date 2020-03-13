const express = require('express')

module.exports = function({articleManager}){

	const router = express.Router()

	router.get("/", function(request, response){

		articleManager.getAllArticles(function(errors, articles){
			const model = {
				allArticles: articles,
				activeUser: null
			}
			console.log("articles in articlerouter: ", articles);
			
			if(errors.length){console.log("in home errors:", errors);}

			if(request.session.activeUser){
				model.activeUser = request.session.activeUser.username
			}
			
			response.render("home.hbs", model)
		})
		
	})

	router.get("/about", function(request, response){
		const model = getSession(request)
		response.render("about.hbs", model)
	})

	router.get("/contact", function(request, response){
		const model = getSession(request)
		response.render("contact.hbs", model)
	})

	router.get('/article/:id', function(request, response){
		const model = {
			article: null,
			error: null,
			activeUser: getSession(request)
		}

		articleManager.getArticleById(request.params.id, function(errors, article){
			if(0 < errors.length){
				console.log("error in get article by id in Router: ", errors);
				model.error = errors
				response.render("show-article.hbs", model)
			}else{
				model.article = article
				response.render("show-article.hbs", model)
			}
		})

	})

	router.get('/create-article', function(request, response){
		const model = {
			activeUser: getSession(request)
		}
		if(request.session.activeUser){
			response.render('create-article.hbs', model)
		}
		else{	
			response.render('accounts-sign-in.hbs', model)
		}
		
	})

	router.post('/create-article', function(request, response){
		const model ={
			title: request.body.title,
			description: request.body.description,
			content: request.body.content,
			username: request.session.activeUser.username
		}
		articleManager.createArticle(model, function(errors){
			if(0 < errors.length){
				const error = {
					error: errors[0]
				}
				console.log("***errorS in createarticle router:" , error);
				response.render('create-article.hbs', error)
			}
			else{
				
				response.redirect('/');
			}
		})
		
	
		
		
	})

	


	return router
}

function getSession(request){
	if(request.session.activeUser){
		return {activeUser: request.session.activeUser.username}
	}
	return null
}






