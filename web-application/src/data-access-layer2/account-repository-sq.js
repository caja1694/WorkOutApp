const Sequelize = require('sequelize');
const sequelize = new Sequelize('webAppDatabase2', 'root', 'theRootPassword', {
  host: 'database2',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      'Connection from account repo has been established successfully.'
    );
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = function (container) {
  return {
    /*
      Retrieves all accounts ordered by username.
      Possible errors: databaseError
      Success value: The fetched accounts in an array.
    */
    getAllAccounts: function (callback) {
      const accountModel = getAccountTableModel();
      accountModel
        .findAll()
        .then(function (accounts) {
          const accountsToReturn = [];
          for (let i = 0; i < accounts.length; i++) {
            accountsToReturn.push(accounts[i].dataValues);
          }
          callback([], accountsToReturn);
        })
        .catch(function (error) {
          callback(['ERR_DATABASE'], null);
        });
    },

    /*
      Retrieves the account with the given username.
      Possible errors: databaseError
      Success value: The fetched account, or null if no account has that username.
		*/
    getAccountByUsername: function (username, callback) {
      const accountModel = getAccountTableModel();
      accountModel
        .findOne({
          where: { username: username },
        })
        .then(function (account) {
          if (account) {
            callback([], account);
          } else {
            callback(['ERR_USERNAME_MISSING'], null);
          }
        })
        .catch(function (error) {
          console.log('Error getting account: ', error);
          callback(['ERR_DATABASE'], null);
        });
    },
    /*
      Creates a new account.
      account: {username: "The username", password: "The password"}
      Possible errors: databaseError, usernameTaken
      Success value: The id of the new account.
		*/
    createAccount: function (account, callback) {
      const accountModel = getAccountTableModel();
      accountModel
        .create({
          username: account.username,
          email: account.email,
          password: account.password,
        })
        .then(function () {
          callback([]);
        })
        .catch(function (error) {
          if (error.parent.code == 'ER_DUP_ENTRY') {
            callback(['ERR_DUP_ENTRY'], null);
          } else {
            callback(['ERR_DATABASE'], null);
          }
        });
    },
  };
};

function getAccountTableModel() {
  return sequelize.define('account', {
    username: Sequelize.TEXT,
    email: Sequelize.TEXT,
    password: Sequelize.TEXT,
  });
}
