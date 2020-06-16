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
      articleModel
        .create({
          title: article.title,
          description: article.description,
          content: article.content,
          username: article.username,
        })
        .then(function () {
          callback([]);
        })
        .catch(function (error) {
          callback(['ERR_DATABASE']);
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
    deleteArticle: function (id, callback) {
      const articleModel = getArticleTableModel();
      articleModel
        .destroy({
          where: { id: id },
        })
        .then(function () {
          callback(['']);
        })
        .catch(function (error) {
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
    },
    {
      timestamps: false,
    }
  );
}
