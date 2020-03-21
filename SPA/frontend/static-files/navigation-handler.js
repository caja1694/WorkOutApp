// TODO: Don't write all JS code in the same file.
document.addEventListener("DOMContentLoaded", function(){
	console.log("REALOADING JS FILE")
	changeToPage(location.pathname)
	if(localStorage.accessToken){
		console.log("localStorage.accessToken: ", localStorage.accessToken)
		login(localStorage.accessToken)
	}else{
		logout()
	}
	
	document.body.addEventListener("click", function(event){
		if(event.target.tagName == "A"){
			event.preventDefault()
			const url = event.target.getAttribute("href")
			goToPage(url)
		}
	})
	
	// TODO: Avoid using this long lines of code.
	document.querySelector("#create-pet-page form").addEventListener("submit", function(event){
		event.preventDefault()
		
		const name = document.querySelector("#create-pet-page .name").value
		
		const pet = {
			name
		}
		
		// TODO: Build an SDK (e.g. a separate JS file)
		// handling the communication with the backend.
		fetch(
			"http://localhost:8080/articles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+localStorage.accessToken
				},
				body: JSON.stringify(pet)
			}
		).then(function(response){
			// TODO: Check status code to see if it succeeded. Display errors if it failed.
			// TODO: Update the view somehow.
			console.log(response)
		}).catch(function(error){
			// TODO: Update the view and display error.
			console.log(error)
		})
	})
	
	document.querySelector("#login-page form").addEventListener("submit", function(event){
		event.preventDefault()
		
		const username = document.querySelector("#login-page .username").value
		const password = document.querySelector("#login-page .password").value
		
		fetch(
			"http://localhost:8080/rest-api/sign-in", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: "grant_type=password&username="+escape(username)+"&password="+escape(password)
			}
			).then(function(response){
				// TODO: Check status code to see if it succeeded. Display errors if it failed.
				if(response.status == 500){
					goToPage("/error-page")
				}
				else if(response.status == 400){
					goToPage("/error-page")
				}
				else{
					return response.json()
				}

			}).then(function(body){
				// TODO: Read out information about the user account from the id_token.
				console.log("body.id_token", body.id_token)
				login(body.access_token)
			}).catch(function(error){
			console.log(error)
		})
	})
	document.querySelector("#sign-up-page form").addEventListener("submit", function(event){
		console.log("Pressed submit1")
		event.preventDefault()
		console.log("Pressed submit")
		const username = document.querySelector("#sign-up-page .username").value
		const email = document.querySelector("#sign-up-page .email").value
		const password = document.querySelector("#sign-up-page .password").value
		const confirmationPassword = document.querySelector("#sign-up-page .confirmationPassword").value

		fetch(
			"http://localhost:8080/rest-api/sign-up", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: "username="+escape(username)+"&email="+escape(email)+"&password="+escape(password)+"&confirmationPassword="+escape(confirmationPassword)
			}
		).then(function(response){
			console.log("Response status sign-up: ", response.status)
			if(response.status == 200){
				return response.json
			}
			else{
				goToPage("/error-page")
			}
		}).then(function(body){
			goToPage("/login")
		}).catch(function(error){
			console.log("Error creating new account: ", error)
		})
	})
	
})

function fetchAllArticles(){
	
	fetch(
		"http://localhost:8080/rest-api/articles"
	).then(function(response){
		// TODO: Check status code to see if it succeeded. Display errors if it failed.
		console.log("STATUS CODE RECIEVED WHEN FETCHING ARTICLES: ", response.status)
		return response.json()
	}).then(function(articles){
		console.log("Articles recieved from fetchallarticles: ", articles)
		const ul = document.querySelector("#articles-page ul")
		ul.innerText = ""
		for(const article of articles.articles){
			const li = document.createElement("li")
			const anchor = document.createElement("a")
			anchor.innerText = article.title
			anchor.setAttribute("href", '/articles/'+article.id)
			li.appendChild(anchor)
			ul.append(li)
		}
	}).catch(function(error){
		console.log(error)
	})
	
}

function fetchArticle(id){
	
	fetch(
		"http://localhost:8080/rest-api/articles/"+id
	).then(function(response){
		// TODO: Check status code to see if it succeeded. Display errors if it failed.
		console.log("Status code when fetching single article: ", response.status)
		return response.json()
	}).then(function(article){
		console.log("Article.title recieved from fetching article by ID: ", article.title)
		const titleSpan = document.querySelector("#article-page .title")
		const contentSpan = document.querySelector("#article-page .content")
		titleSpan.innerText = article.title
		contentSpan.innerText = article.content
	}).catch(function(error){
		console.log(error)
	})
	
}

window.addEventListener("popstate", function(event){
	const url = location.pathname
	changeToPage(url)
})

function goToPage(url){
	
	changeToPage(url)
	history.pushState({}, "", url)
}

function changeToPage(url){
	
	const currentPageDiv = document.getElementsByClassName("current-page")[0]
	if(currentPageDiv){
		currentPageDiv.classList.remove("current-page")
	}
	
	// TODO: Optimally this information can be put in an array instead of having a long list of if-else if statements.
	// TODO: Factor out common code in all branches.
	if(url == "/"){
		document.getElementById("home-page").classList.add("current-page")
	}else if(url == "/about"){
		document.getElementById("about-page").classList.add("current-page")
	}else if(url == "/articles"){
		document.getElementById("articles-page").classList.add("current-page")
		fetchAllArticles()
	}else if(url == "/login"){
		document.getElementById("login-page").classList.add("current-page")
	}else if(url == "/sign-up"){
		document.getElementById("sign-up-page").classList.add("current-page")
	}else if(new RegExp("^/articles/[0-9]+$").test(url)){
		document.getElementById("article-page").classList.add("current-page")
		const id = url.split("/")[2]
		fetchArticle(id)
	}else if(url == "/create-pet"){
		document.getElementById("create-pet-page").classList.add("current-page")
	}else if(url == "/logout"){
		logout()
	}else if(url == "/error-page"){
		document.getElementById("error-page").classList.add("current-page")
	}else{
		document.getElementById("error-page").classList.add("current-page")
	}
	
}

function login(accessToken){
	console.log("Document.body.classlist: ", document.body.classList)
	localStorage.accessToken = accessToken
	document.body.classList.add("isLoggedIn")
	document.body.classList.remove("isLoggedOut")
	goToPage('/')
}

function logout(){
	console.log("Login out")
	localStorage.accessToken = ""
	document.body.classList.remove("isLoggedIn")
	document.body.classList.add("isLoggedOut")
}