const sql = require('mysql');
const db = sql.createConnection({
  host: 'database',
  user: 'root',
  password: 'theRootPassword',
  database: 'webAppDatabase',
});

db.connect(function (error) {
  if (error) {
    console.log('Connection error in token repo');
  } else console.log('Connected to db in account repo');
});

module.exports = function (container) {
  return {
    storeToken: function (token, callback) {
      const query = 'INSERT INTO tokens (token, userId) VALUES (?, ?)';
      const values = [token.token, token.userId];
      db.query(query, values, function (error, result) {
        if (error) {
          if (error.code == 'ER_DUP_ENTRY') {
            callback(['ERR_ALREADY_SIGNED_IN'], null);
          } else {
            console.log('Error storing token: ', error.parent.code);
            callback(['ERR_DATABASE'], null);
          }
        } else {
          callback([], token);
        }
      });
    },

    getToken: function (token, callback) {
      const query = 'SELECT * FROM tokens WHERE token = ? LIMIT 1';
      const values = [token.token];
      db.query(query, values, function (error, token) {
        if (error) {
          callback(['ERR_DATABASE'], null);
        } else if (token) {
          callback([], token);
        } else {
          console.log('Error retreiving token from db: ', error);
          callback(['ERR_TOKEN_MISSING'], null);
        }
      });
    },
    // Delete token
    removeToken: function (token, callback) {
      const query = 'DELETE FROM tokens WHERE token = ?';
      const values = token.token;

      db.query(query, values, function (error) {
        if (error) {
          console.log('Error deleting token', error);
          callback(['ERR_DATABASE']);
        } else {
          callback([]);
        }
      });
    },
  };
};
