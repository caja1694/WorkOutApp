const Sequelize = require('sequelize');
const db = new Sequelize('webAppDatabase2', 'root', 'theRootPassword', {
  host: 'database2',
  dialect: 'mysql',
});

db.authenticate()
  .then(() => {
    console.log(
      'Connection from article repository has been established successfully.'
    );
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = function () {
  return {
    /* 
        Create a new article
        Possible errors: database Error
        Success Value: ID of the new article
    */
    createArticle: function (article, callback) {
      const articleModel = getArticleTableModel();
      console.log('Article id received : ', article);
      articleModel
        .create({
          title: article.title,
          description: article.description,
          content: article.content,
          username: article.username,
          ownerId: article.ownerId,
        })
        .then(function (result) {
          console.log('Created article with ownerId: ', result.ownerId);
          callback([], result);
        })
        .catch(function (error) {
          console.log('Error creating article: ', error);
          callback(['ERR_DATABASE'], null);
        });
    },
    /*
    Retreive all articles
    Possible erros: database error
    Success value: An array with all articles
    */
    getAllArticles: function (callback) {
      const articleModel = getArticleTableModel();
      articleModel
        .findAll()
        .then(function (articles) {
          const articlesToReturn = [];
          for (let i = 0; i < articles.length; i++) {
            articlesToReturn.push(articles[i].dataValues);
          }
          callback([], articlesToReturn);
        })
        .catch(function (error) {
          callback(['ERR_DATABASE'], null);
        });
    },
    /*
        Retreives the article with the given ID
        Possible errors: Database error
        Success value: The article with the given ID
    */
    getArticleById: function (id, callback) {
      const articleModel = getArticleTableModel();
      articleModel
        .findAll({
          where: { id: id },
        })
        .then(function (article) {
          callback([], article[0].dataValues);
        })
        .catch(function (error) {
          callback(['ERR_DATABASE'], null);
        });
    },
    /*
        Delete the article with the given ID
        Possible errors: Database error
        Success Value: The ID of the deleted article 
    */
    deleteArticle: function (id, ownerId, callback) {
      const articleModel = getArticleTableModel();
      console.log('Deleting article with owner id: ', ownerId);
      articleModel
        .destroy({
          where: { id: id, ownerId: ownerId },
        })
        .then(function (result) {
          console.log('Deleted article in repo got no errors', result);
          callback([]);
        })
        .catch(function (error) {
          console.log('Error deleting article: ', error);
          callback(['ERR_DATABASE']);
        });
    },

    updateArticle: function (article, articleId, ownerId, callback) {
      const articleModel = getArticleTableModel();
      articleModel
        .update(
          {
            title: article.title,
            description: article.description,
            content: article.content,
          },
          {
            where: { id: articleId, ownerId: ownerId },
          }
        )
        .then(function () {
          console.log('In article repo: successfully updated article');
          callback([]);
        })
        .catch(function (error) {
          console.log('In articlerepo, error updating article repo: ', error);
          callback(['ERR_DATABASE']);
        });
    },
  };
};

function getArticleTableModel() {
  return db.define(
    'article',
    {
      title: Sequelize.TEXT,
      description: Sequelize.TEXT,
      content: Sequelize.TEXT,
      username: Sequelize.TEXT,
      ownerId: Sequelize.TEXT,
    },
    {
      timestamps: false,
    }
  );
}
