const express = require('express');
const crypto = require('crypto');

module.exports = function ({ accountManager }) {
  const router = express.Router();

  // Render sign up page
  router.get('/sign-up', function (request, response) {
    response.render('accounts-sign-up.hbs');
  });

  // Render sign in page
  router.get('/sign-in', function (request, response) {
    response.render('accounts-sign-in.hbs');
  });

  router.get('/sign-out', function (request, response) {
    console.log('Destroying session');
    request.session.destroy(function (error) {
      console.log(error);
    });
    response.redirect('/');
  });

  // Get all accounts
  router.get('/', function (request, response) {
    accountManager.getAllAccounts(function (errors, accounts) {
      if (errors.length) {
        console.log('Errors in get all acounts', errors);
      }
      const model = {
        errors: errors,
        accounts: accounts,
        activeUser: getSession(request),
      };
      response.render('accounts-list-all.hbs', model);
    });
  });
  // Get account
  router.get('/:username', function (request, response) {
    const username = request.params.username;

    accountManager.getAccountByUsername(username, function (errors, account) {
      const model = {
        errors: errors,
        account: account,
      };
      response.render('accounts-show-one.hbs', model);
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
    accountManager.createAccount(account, function (errors) {
      if (0 < errors.length) {
        const error = {
          error: errorHandler(errors[0]),
        };
        response.render('accounts-sign-up.hbs', error);
      } else {
        response.redirect('/accounts/sign-in');
      }
    });
  });
  // Login
  router.post('/sign-in', function (request, response) {
    const account = {
      username: request.body.username,
      password: request.body.password,
    };
    accountManager.getAccountForLogin(account, function (
      errors,
      accountFromDb
    ) {
      if (0 < errors.length) {
        const error = {
          error: errorHandler(errors[0]),
        };
        response.render('accounts-sign-in.hbs', error);
      } else {
        request.session.activeUser = {
          username: accountFromDb.username,
          id: accountFromDb.accountId,
        };
        response.redirect('/');
      }
    });
  });
  return router;
};

function errorHandler(errorCode) {
  let errorMessage = '';
  switch (errorCode) {
    case 'ERR_USERNAME_MISSING':
      errorMessage = 'Wrong username or password';
      break;
    case 'ERR_WRONG_PASSWORD':
      errorMessage = 'Wrong username or password';
      break;
    case 'ERR_DATABASE':
      errorMessage = 'We hit an error with the database';
      break;
    case 'ERR_DUP_ENTRY':
      errorMessage = 'Username is already taken';
      break;
    case 'ERR_USERNAME_TO_SHORT':
      errorMessage = 'Username too short';
      break;
    case 'ERR_USERNAME_TO_LONG':
      errorMessage = 'Username too long';
      break;
    case 'ERR_PASSWORD_NO_MATCH':
      errorMessage = "Passwords didn't match";
      break;
    case 'ERR_PASSWORD_TO_SHORT':
      errorMessage = 'Password must be atleast 4 characters long';
      break;
    case 'ERR_AUTH':
      errorMessage = 'You are not authorized to do that';
    default:
      errorMessage = 'We hit an error loggin in';
      break;
  }
  return errorMessage;
}

function getSession(request) {
  if (request.session.activeUser) {
    return { activeUser: request.session.activeUser.username };
  }
  return null;
}
