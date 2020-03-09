const express = require('express')

module.exports = function(container){

	const router = express.Router()

	const allBlogs = [{title: "title", content: "The Beast stumbled in the dark for it could no longer see the path. It started to fracture and weaken, trying to reshape itself into the form of metal. Even the witches would no longer lay eyes upon it, for it had become hideous and twisted."},
	{title: "title2", content: "The soul of the Beast seemed lost forever. Then, by the full moon's light, a child was born; child with the unbridled soul of the Beast that would make all others pale in comparison."},{title: "title3", content: "The Beast stumbled in the dark for it could no longer see the path. It started to fracture and weaken, trying to reshape itself into the form of metal. Even the witches would no longer lay eyes upon it, for it had become hideous and twisted."},
	{title: "title4", content: "The soul of the Beast seemed lost forever. Then, by the full moon's light, a child was born; child with the unbridled soul of the Beast that would make all others pale in comparison."},{title: "title5", content: "The Beast stumbled in the dark for it could no longer see the path. It started to fracture and weaken, trying to reshape itself into the form of metal. Even the witches would no longer lay eyes upon it, for it had become hideous and twisted."},
	{title: "title6", content: "The soul of the Beast seemed lost forever. Then, by the full moon's light, a child was born; child with the unbridled soul of the Beast that would make all others pale in comparison."}];

	router.get("/", function(request, response){

		const model = {
			allBlogs: allBlogs,
			activeUser: null
		}
		if(request.session.activeUser){
			console.log("in if")
			model.activeUser = request.session.activeUser.username
		}

		console.log(model.activeUser)
		response.render("home.hbs", model)
	})

	router.get("/about", function(request, response){
		response.render("about.hbs")
	})

	router.get("/contact", function(request, response){
		response.render("contact.hbs")
	})
	return router

}






