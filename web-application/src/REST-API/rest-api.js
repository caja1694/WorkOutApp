const express = require('express');

module.exports = function (container) {
  const router = express.Router();

  router.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.setHeader('Access-Control-Allow-Methods', 'http://localhost:3000');
    response.setHeader('Access-Control-Allow-Headers', 'http://localhost:3000');
    response.setHeader(
      'Access-Control-Expose-Headers',
      'http://localhost:3000'
    );
    next();
  });

  router.get('/articles', function (request, response) {
    try {
      container.articleManager.getAllArticles(function (errors, articles) {
        if (errors.length > 0) {
          response.status(500).end();
        } else {
          response.status(200).json({ articles: articles });
        }
      });
    } catch (e) {
      console.log('In /myworkouts got error: ', e);
      response.status(401).end();
      return;
    }
  });

  router.get('/articles/:id', function (request, response) {
    const id = request.params.id;
    container.articleManager.getArticleById(id, function (errors, article) {
      if (0 < errors.length) {
        response.status(500).end();
      } else if (!article) {
        response.status(404).end();
      } else {
        response.status(200).json(article);
      }
    });
  });

  // Create article
  router.post('/articles', function (request, response) {
    const article = {
      title: request.body.title,
      description: request.body.description,
      content: request.body.content,
      username: request.body.username,
    };

    container.articleManager.createArticle(article, function (errors, article) {
      console.log('Article received from DLL to rest-api: ', article);
      const id = article.id;

      if (errors.includes('ERR_DATABASE')) {
        console.log('Error 500 in create article');
        response.status(500).end();
      } else if (0 < errors.length) {
        console.log('Error 400 in create article');
        response.status(400).json(errors);
      } else {
        console.log('Created article -> Redirecting to /articles/id', id);
        response.setHeader('Location', '/articles/' + id);
        response.status(201).end();
      }
    });
  });

  // Update article
  router.put('/articles/:id', function (request, response) {
    const id = request.params.id;
    const article = {
      title: request.body.title,
      description: request.body.description,
      content: request.body.content,
    };
    container.articleManager.updateArticle(article, id, function (errors, id) {
      if (errors.includes('databaseError')) {
        response.status(500).end();
      } else if (0 < errors.length) {
        response.status(400).json(errors);
      } else {
        response.setHeader('Location', '/articles/');
        response.status(204).end();
      }
    });
  });

  // Delete article
  router.delete('/articles/:id', function (request, response) {
    const id = request.params.id;
    console.log('Request.decoded :', request.decoded);

    container.articleManager.deleteArticle(id, function (errors) {
      if (0 < errors.length) {
        console.log('error deleting article: ', errors);
        response.status(500).end();
      } else {
        console.log('Article deleted');
        response.status(204).end();
      }
    });
  });
  // Create account
  router.post('/sign-up', function (request, response) {
    const account = {
      username: request.body.username,
      email: request.body.email,
      password: request.body.password,
      confirmationPassword: request.body.confirmationPassword,
    };
    console.log('Sign up request, got model: ', account);

    container.accountManager.createAccount(account, function (errors) {
      console.log('Creating new account');
      if (0 < errors.length) {
        const error = errorHandler(errors[0]);
        response.status(error.statusCode).json({ error: error.errorMessage });
      } else {
        console.log('Created new account');
        response.status(200).end();
      }
    });
  });

  // Login
  router.post('/sign-in', function (request, response) {
    const grantType = request.body.grant_type;
    const account = {
      username: request.body.username,
      password: request.body.password,
    };
    if (grantType != 'password') {
      console.log('REST-API: error GrantType not password');
      response.status(400).json({ error: 'unsupported_grant_type' });
      return;
    }

    container.accountManager.getAccessToken(account, function (
      errors,
      accessToken
    ) {
      if (0 < errors.length) {
        const error = errorHandler(errors[0]);
        console.log('Error getting accesstoken in rest-api: ', errors[0]);
        response.status(error.statusCode).json({ error: error.errorMessage });
      } else {
        console.log('REST_API Responding with accessToken', accessToken);
        response.status(200).json({
          access_token: accessToken,
        });
      }
    });
  });
  return router;
};

function errorHandler(errorCode) {
  let message = '';
  let status = 500;
  let error = {
    errorMessage: null,
    statusCode: null,
  };
  switch (errorCode) {
    case 'ERR_USERNAME_MISSING':
      message = 'invalid_client';
      status = 400;
      break;
    case 'ERR_WRONG_PASSWORD':
      message = 'invalid_client';
      status = 400;
      break;
    case 'ERR_DATABASE':
      message = 'server_error';
      status = 500;
      break;
    case 'ERR_USERNAME_TO_SHORT':
      message = 'client_error';
      status = 400;
      break;
    case 'ERR_USERNAME_TO_LONG':
      message = 'client_error';
      status = 400;
      break;
    case 'ERR_PASSWORD_NO_MATCH':
      message = 'client_error';
      status = 400;
      break;
    case 'ERR_NOT_AUTHORIZED':
      message = 'unauthorized_client';
      status = 400;
    default:
      message = 'server_error';
      status = 500;
      break;
  }
  error.errorMessage = message;
  error.statusCode = status;
  return error;
}
