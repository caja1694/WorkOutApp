const sql = require('mysql');
const db = sql.createConnection({
  host: 'database',
  user: 'root',
  password: 'theRootPassword',
  database: 'webAppDatabase',
});

db.connect(function (error) {
  if (error) {
    console.log('Connection error in account repo', error);
  } else console.log('Connected to db in account repo');
});

module.exports = function (container) {
  return {
    /*
		Retrieves all accounts ordered by username.
		Possible errors: databaseError
		Success value: The fetched accounts in an array.
		*/
    getAllAccounts: function (callback) {
      const query = `SELECT * FROM accounts ORDER BY username`;
      const values = [];

      db.query(query, values, function (error, accounts) {
        if (error) {
          callback(['ERR_DATABASE'], null);
        } else {
          callback([], accounts);
        }
      });
    },
    /*
		Retrieves the account with the given username.
		Possible errors: databaseError
		Success value: The fetched account, or null if no account has that username.
		*/
    getAccountByUsername: function (username, callback) {
      const query = `SELECT * FROM accounts WHERE username = ? LIMIT 1`;
      const values = [username];

      db.query(query, values, function (error, accounts) {
        if (error) {
          callback(['ERR_DATABASE'], null);
        } else if (accounts.length == 0) {
          callback(['ERR_USERNAME_MISSING'], null);
        } else {
          console.log('Returning accounts[0] from database: ', accounts[0]);
          callback([], accounts[0]);
        }
      });
    },
    /*
		Creates a new account.
		account: {username: "The username", password: "The password"}
		Possible errors: databaseError, usernameTaken
		Success value: The id of the new account.
		*/
    createAccount: function (account, callback) {
      const query = `INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)`;
      const values = [account.username, account.email, account.password];

      db.query(query, values, function (error, results) {
        if (error) {
          if (error.code == 'ER_DUP_ENTRY') {
            callback(['ERR_DUP_ENTRY'], null);
          } else {
            console.log(error);
            callback(['ERR_DATABASE'], null);
          }
        } else {
          callback([], results.insertId);
        }
      });
    },
  };
};
