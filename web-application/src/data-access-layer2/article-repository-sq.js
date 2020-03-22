const Sequelize = require('sequelize')
const db = new Sequelize('webAppDatabase2', 'root', 'theRootPassword',{
	host: 'database2',
	dialect: 'mysql'
})

db
  .authenticate()
  .then(() => {
    console.log('Connection from article repository has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  module.exports = function(){
      return  {
          createArticle: function(article, callback){
            const articleModel = getArticleTableModel()
            articleModel.create({title: article.title, description: article.description, content: article.content, username: article.username})
            .then(function(){
                console.log("Inserting new article in database")
                callback([])
            })
            .catch(function(error){
                callback(["ERR_DATABASE"])
            })
          },
          getAllArticles: function(callback){
            const articleModel = getArticleTableModel()
            articleModel.findAll()
            .then(function(articles){
                const articlesToReturn = []
                for(let i = 0; i < articles.length; i++){
                    articlesToReturn.push(articles[i].dataValues)
                }
                callback([], articlesToReturn)
            })
            .catch(function(error){
                console.log("Error retreiving all articles: ", error)
                callback(["ERR_DATABASE"], null)
            })
          },
          getArticleById: function(id, callback){
              const articleModel = getArticleTableModel()
              articleModel.findAll({
                  where: {id: id}
              })
              .then(function(article){
                console.log(article[0])
                callback([], article[0].dataValues)
              })
              .catch(function(error){
                  console.log("Error getting article", error)
                  callback(["ERR_DATABASE"], null)
              })
          },
          deleteArticle: function(id, callback){
            const articleModel = getArticleTableModel()
            articleModel.destroy({
                where: {id: id}
            })
            .then(function(){
                callback([""])
            })
            .catch(function(error){
                console.log("Error removing from database")
                callback(["ERR_DATABASE"])
            })
          }
      }
  }

  function getArticleTableModel(){
      return db.define("article", {
          title: Sequelize.TEXT,
          description: Sequelize.TEXT,
          content: Sequelize.TEXT,
          username: Sequelize.TEXT
      },{
          timestamps: false
      })
  }