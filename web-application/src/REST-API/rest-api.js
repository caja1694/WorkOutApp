const express = require('express');

const WRONG_PASSWORD = 460;
const TOKEN_ALREADY_EXISTS = 461;

module.exports = function (container) {
  const router = express.Router();

  router.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Expose-Headers', '*');
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
    var token = null;
    const article = {
      title: request.body.title,
      description: request.body.description,
      content: request.body.content,
      username: request.body.username,
      ownerId: request.body.ownerId,
    };
    try {
      token = JSON.parse(request.headers.authorization);
      console.log('Token  = ', token);
    } catch (error) {
      console.log('No token received');
      response.status(401).json();
      return;
    }

    container.articleManager.createArticle(article, token, function (
      errors,
      article
    ) {
      console.log('Response from article repo article: ', article);
      if (errors.includes('ERR_DATABASE')) {
        console.log('Error 500 in create article');
        response.status(500).end();
      } else if (0 < errors.length) {
        const error = errorHandler(errors[0]);
        response.status(400).json(error);
      } else {
        const id = article.id;
        console.log('Created article -> Redirecting to /articles/id', id);
        response.setHeader('Location', '/articles/' + id);
        response.status(201).end();
      }
    });
  });

  // Update article
  router.put('/articles/:id', function (request, response) {
    const id = request.params.id;
    var token = null;
    try {
      token = JSON.parse(request.headers.authorization);
    } catch (error) {
      console.log('rest-api error updating article', error);
      response.status(401).json();
    }
    const article = {
      title: request.body.title,
      description: request.body.description,
      content: request.body.content,
    };
    container.articleManager.updateArticle(article, id, token, function (
      errors,
      id
    ) {
      if (errors.includes('ERR_DATABASE')) {
        response.status(500).end();
      } else if (0 < errors.length) {
        const error = errorHandler(errors[0]);
        response.status(error.statusCode).json({ error: error.errorMessage });
      } else {
        response.setHeader('Location', '/articles/');
        response.status(204).end();
      }
    });
  });

  // Delete article
  router.delete('/articles/:id', function (request, response) {
    const id = request.params.id;
    var token = null;
    try {
      token = JSON.parse(request.headers.authorization);
      console.log('authheader: ', token);
    } catch (error) {
      console.log('Delete article in api error', error);
      response.status(401).json();
      return;
    }

    container.articleManager.deleteArticle(id, token, function (errors) {
      if (0 < errors.length) {
        const error = errorHandler(errors[0]);
        console.log('error deleting article: ', errors);
        response.status(error.statusCode).json({ error: error.errorMessage });
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

    container.accountManager.createAccount(account, function (errors) {
      if (0 < errors.length) {
        const error = errorHandler(errors[0]);
        response.status(error.statusCode).json({ error: error.errorMessage });
      } else {
        response.status(200).json({ error: '' });
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
        console.log(
          'Error getting accesstoken in rest-api: ',
          error.statusCode
        );
        response.status(error.statusCode).json({ error: error.errorMessage });
      } else {
        console.log(
          'REST_API Responding with accessToken',
          accessToken.dataValues
        );
        response.status(200).json({
          access_token: accessToken,
        });
      }
    });
  });

  // Logout
  router.delete('/logout', function (request, response) {
    const token = JSON.parse(request.headers.authorization);
    console.log('in rest-api, deleting token: ', token.token);
    container.tokenRepo.removeToken(token, function (errors) {
      if (0 < errors) {
        console.log('error deleting token');
        response.status(500).json({ error: 'Error deleting access token' });
      } else {
        console.log('Successfully deleted token');
        response.status(200).json();
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
  console.log('Error code: ', errorCode);
  switch (errorCode) {
    case 'ERR_USERNAME_MISSING':
      message = 'invalid_client';
      status = 460;
      break;
    case 'ERR_DUP_ENTRY':
      message = 'invalid_client';
      status = 409;
      break;
    case 'ERR_WRONG_PASSWORD':
      message = 'invalid_client';
      status = WRONG_PASSWORD;
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
    case 'ERR_PASSWORD_TO_SHORT':
      message = 'client_error';
      status = 400;
      break;
    case 'ERR_NOT_AUTHORIZED':
      message = 'unauthorized_client';
      status = 401;
      break;
    case 'ERR_ALREADY_SIGNED_IN':
      message = 'client_error';
      status = TOKEN_ALREADY_EXISTS;
      break;
    default:
      message = 'server_error';
      status = 500;
      break;
  }
  error.errorMessage = message;
  error.statusCode = status;
  return error;
}
