const crypto = require('crypto');

module.exports = function ({ accountRepo, accountValidator, tokenRepo }) {
  return {
    getAllAccounts: function (callback) {
      accountRepo.getAllAccounts(callback);
    },
    createAccount: function (account, callback) {
      const errors = accountValidator.getErrorsNewAccount(account);
      if (0 < errors.length) {
        callback(errors, null);
        return;
      } else {
        account.password = getHash(account.password);
      }
      accountRepo.createAccount(account, callback);
    },
    getAccountByUsername: function (username, callback) {
      accountRepo.getAccountByUsername(username, callback);
    },

    getAccountForLogin: function (enteredAccount, callback) {
      const checkPass = getHash(enteredAccount.password);
      accountRepo.getAccountByUsername(enteredAccount.username, function (
        errors,
        accountFromDB
      ) {
        if (0 < errors.length) {
          callback(errors);
        } else if (checkPass == accountFromDB.password) {
          const accountModel = {
            username: accountFromDB.username,
            accountId: accountFromDB.id,
          };
          callback([], accountModel);
        } else {
          callback(['ERR_WRONG_PASSWORD']);
        }
      });
    },
    getAccessToken: function (enteredAccount, callback) {
      // Authorizing account for access token
      this.getAccountForLogin(enteredAccount, function (errors, account) {
        if (0 < errors.length) {
          console.log('Error in account-manager: ', errors);
          callback(errors);
        } else {
          console.log('Creating access token, got account: ', account);
          const tokenVal = generateToken();
          const token = {
            token: tokenVal,
            userId: account.accountId,
          };
          tokenRepo.storeToken(token, callback);
        }
      });
    },
  };
};
function generateToken() {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var tokenLength = 5;
  for (var i = 0; i < tokenLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * tokenLength));
  }
  result = getHash(result);
  return result;
}

function getHash(value) {
  const alg = 'sha256';
  const hash = crypto
    .createHmac(alg, value)
    .update('I love cupcakes')
    .digest('hex');
  return hash;
}
