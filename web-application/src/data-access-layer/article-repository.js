const db = require('./db')

module.exports = function(container){
    return{
        createArticle: function(article, callback){
			const query = `INSERT INTO articles (title, description ,content, username) VALUES (?, ?, ?, ?)`
			const values = [article.title, article.description ,article.content, article.username]
			
            db.query(query, values, function(error, results){
				if(error){
					console.log("ERROR IN DB WHEN CREATING ARTICLE: ", error);
					
					callback(['ERR_DATABASE'], null)
				}
				else{
					console.log("article repository: Result.id: ", results.insertId)
					callback([], results.insertId)
				}
			})
        }, 
        
        getAllArticles: function(callback){
			const query = `SELECT * FROM articles ORDER BY id DESC`
			const values = []
			
			db.query(query, values, function(error, articles){
				if(error){
                    callback(['ERR_DATABASE'], null)
                    console.log("in articlerepo error: ",error);
                    
				}else{          
					callback([], articles)
				}
			})
		},

		getArticleById: function(id, callback){
			const query = `SELECT * FROM articles WHERE id = ? LIMIT 1`
			const values = [id]

			db.query(query, values, function(error, article){
				if(error){
					callback(['ERR_DATABASE'], null)
                    console.log("in getsingle article REPO error: ",error);
				}else{          
					callback([], article[0])
				}
			})
		},
		updateArticle: function(article, id, callback){
			console.log("article in update article: ", article)
			const query = 'UPDATE articles SET title = ?, description = ?, content = ? WHERE id = ?'
			const values = [article.title, article.description, article.content, id]
			
			db.query(query, values, function(error, results){
				if(error){
					console.log("Error updating article: ", error)
					callback(['ERR_DATABASE'], null)
				}
				else{
					console.log("updated article with id :", results.insertId)
					callback([], results.insertId)
				}

			})
		},
		deleteArticle: function(id, callback){
			const query = `DELETE FROM articles WHERE id = ? LIMIT 1`
			const values = [id]

			db.query(query, values, function(error){
				if(error){
					callback(['ERR_DATABASE'])
				}
				else{
					callback([])
				}
			})

		}
	}
    }
