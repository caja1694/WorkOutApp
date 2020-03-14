const db = require('./db')

module.exports = function(container){
    return{
        createArticle: function(article, callback){
			const query = `INSERT INTO articles (title, description ,content, username) VALUES (?, ?, ?, ?)`
			const values = [article.title, article.description ,article.content, article.username]
			
            db.query(query, values, function(error){
				if(error){
					console.log("ERROR IN DB WHEN CREATING ARTICLE: ", error);
					
					callback(['databaseError'])
				}
				else{
					callback([])
				}
			})
        }, 
        
        getAllArticles: function(callback){
			const query = `SELECT * FROM articles ORDER BY id DESC`
			const values = []
			
			db.query(query, values, function(error, articles){
				if(error){
                    callback(['databaseError'], null)
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

		deleteArticle: function(id, callback){
			const query = `DELETE FROM articles WHERE id = ? LIMIT 1`
			const values = [id]

			db.query(query, values, function(error){
				if(error){
					callback(['ERR_DATABASE'])
				}
				else{
					callback([""])
				}
			})

		}
	}
    }
