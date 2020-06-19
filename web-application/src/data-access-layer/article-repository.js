const db = require('./db');

db.connect(function (error) {
  if (error) {
    console.log('Connection error in article repo');
  } else console.log('Connected to db in article repo');
});

module.exports = function (container) {
  return {
    /* 
        Create a new article
        Possible errors: database Error
        Success Value: ID of the new article
    */
    createArticle: function (article, callback) {
      const query = `INSERT INTO articles (title, description ,content, username) VALUES (?, ?, ?, ?)`;
      const values = [
        article.title,
        article.description,
        article.content,
        article.username,
      ];

      db.query(query, values, function (error, results) {
        if (error) {
          callback(['ERR_DATABASE'], null);
        } else {
          callback([], results.insertId);
        }
      });
    },

    /*
		Retreive all articles
		Possible erros: database error
		Success value: An array with all articles
    */
    getAllArticles: function (callback) {
      const query = `SELECT * FROM articles ORDER BY id DESC`;
      const values = [];

      db.query(query, values, function (error, articles) {
        if (error) {
          callback(['ERR_DATABASE'], null);
        } else {
          callback([], articles);
        }
      });
    },

    /*
        Retreives the article with the given ID
        Possible errors: Database error
        Success value: The article with the given ID
    */
    getArticleById: function (id, callback) {
      const query = `SELECT * FROM articles WHERE id = ? LIMIT 1`;
      const values = [id];

      db.query(query, values, function (error, article) {
        if (error) {
          callback(['ERR_DATABASE'], null);
        } else {
          callback([], article[0]);
        }
      });
    },
    /*
        Delete the article with the given ID
        Possible errors: Database error
        Success Value: The ID of the deleted article 
    */
    deleteArticle: function (id, callback) {
      const query = `DELETE FROM articles WHERE id = ? LIMIT 1`;
      const values = [id];

      db.query(query, values, function (error) {
        if (error) {
          callback(['ERR_DATABASE']);
        } else {
          callback([]);
        }
      });
    },
  };
};
