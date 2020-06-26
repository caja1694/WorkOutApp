const awilix = require('awilix');

module.exports = function ({ articleRepo, tokenRepo }) {
  return {
    createArticle: function (article, authorization, callback) {
      authorizeUser(authorization, tokenRepo, function (authorized) {
        if (authorized) {
          articleRepo.createArticle(article, callback);
        } else {
          console.log('User not authrized to create article');
          callback(['ERR_NOT_AUTHORIZED']);
        }
      });
    },

    getAllArticles: function (callback) {
      articleRepo.getAllArticles(callback);
    },
    getArticleById: function (id, callback) {
      articleRepo.getArticleById(id, callback);
    },
    updateArticle: function (article, id, authorization, callback) {
      authorizeOwner(authorization, tokenRepo, function (error, ownerId) {
        if (error) {
          console.log('error updating article: ', error);
          callback([error]);
        } else articleRepo.updateArticle(article, id, ownerId, callback);
      });
    },
    deleteArticle: function (id, authorization, callback) {
      authorizeOwner(authorization, tokenRepo, function (error, ownerId) {
        if (error) {
          console.log('Error deleting article: ', error);
          callback([error]);
        } else articleRepo.deleteArticle(id, ownerId, callback);
      });
    },
  };
};

function authorizeOwner(authorization, tokenRepo, callback) {
  if (authorization.type == 'session') {
    callback(null, authorization.activeUser.id);
  } else {
    checkToken(authorization, tokenRepo, function (authorized) {
      if (authorized) {
        console.log('authorized, ', authorization.userId);
        callback(null, authorization.userId);
      } else {
        callback('ERR_NOT_AUTHORIZED', null);
      }
    });
  }
}

function checkToken(authorization, tokenRepo, callback) {
  tokenRepo.getToken(authorization, function (errors, result) {
    console.log('Auth in checktoken', errors[0]);
    if (0 < errors.length) {
      console.log('Error in chectoken: ', errors[0]);
      callback(false);
    } else callback(true);
  });
}

function authorizeUser(authorization, tokenRepo, callback) {
  console.log('Auth: ', authorization);
  if (authorization.type == 'session') {
    callback(true);
  } else {
    console.log('Running checktoken');
    checkToken(authorization, tokenRepo, function (result) {
      console.log('Checktoken gave: ', result);
      callback(result);
    });
  }
}
