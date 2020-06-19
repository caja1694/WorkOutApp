const crypto = require('crypto');

module.exports = function ({ accountRepo, accountValidator }) {
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
  };
};

function getHash(value) {
  const alg = 'sha256';
  const hash = crypto
    .createHmac(alg, value)
    .update('I love cupcakes')
    .digest('hex');
  return hash;
}
