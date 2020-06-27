const express = require('express');

module.exports = function ({ articleManager }) {
  const router = express.Router();

  router.get('/', function (request, response) {
    articleManager.getAllArticles(function (errors, articles) {
      const model = {
        allArticles: articles,
        activeUser: null,
      };
      if (errors.length) {
        console.log('in home errors:', errors);
      }

      if (request.session.activeUser) {
        model.activeUser = request.session.activeUser.username;
      }
      response.render('home.hbs', model);
    });
  });

  router.get('/about', function (request, response) {
    const model = getSessionUsername(request);
    response.render('about.hbs', model);
  });

  router.get('/contact', function (request, response) {
    const model = getSessionUsername(request);
    response.render('contact.hbs', model);
  });

  router.get('/article/:id', function (request, response) {
    const model = {
      article: null,
      error: null,
      activeUser: getSessionUsername(request),
      author: false,
    };

    articleManager.getArticleById(request.params.id, function (
      errors,
      article
    ) {
      if (0 < errors.length) {
        console.log('error in get article by id in Router: ', errors);
        model.error = errors;
        response.render('show-article.hbs', model);
      } else {
        model.article = article;
        if (model.activeUser) {
          if (
            model.activeUser.toLowerCase() ==
            model.article.username.toLowerCase()
          ) {
            model.author = true;
          }
        }

        response.render('show-article.hbs', model);
      }
    });
  });

  router.get('/create-article', function (request, response) {
    if (request.session.activeUser) {
      const model = {
        activeUser: request.session.activeUser.username,
      };
      response.render('create-article.hbs', model);
    } else {
      const model = {
        notAuthorized: true,
      };
      response.render('accounts-sign-in.hbs', model);
    }
  });

  router.post('/create-article', function (request, response) {
    console.log(
      'Creating article with session.activeUser: ',
      request.session.activeUser.id
    );
    const model = {
      title: request.body.title,
      description: request.body.description,
      content: request.body.content,
      username: request.session.activeUser.username,
      ownerId: request.session.activeUser.id,
    };
    articleManager.createArticle(model, request.session, function (errors) {
      if (0 < errors.length) {
        const error = {
          error: errors[0],
        };
        console.log('***errorS in createarticle router:', error);
        response.render('create-article.hbs', error);
      } else {
        response.redirect('/');
      }
    });
  });

  router.post('/deleteArticle/:id', function (request, response) {
    console.log('in delete article');
    articleManager.deleteArticle(request.params.id, request.session, function (
      error
    ) {
      if (0 < error.length) {
        console.log('error in deletepost: ', error);
        response.redirect('/');
      } else {
        response.redirect('/');
      }
    });
  });
  return router;
};

function getSessionUsername(request) {
  if (request.session.activeUser) {
    return request.session.activeUser.username;
  }
  return null;
}
