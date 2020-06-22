const db = require('./db');

db.connect(function (error) {
  if (error) {
    console.log('Connection error in token repo');
  } else console.log('Connected to db in account repo');
});

module.exports = function (container) {
  return {
    storeToken: function (token, callback) {
      const createQuery =
        'CREATE TABLE IF NOT EXISTS tokens (token VARCHAR(255), userId INT UNSIGNED)';
      const query = 'INSERT INTO tokens (token, userId) VALUES (?, ?)';
      const values = [token.token, token.userId];
      db.query(createQuery, function (error) {
        if (error) {
          console.log('Error creating new Table in token-repo: ', error);
        } else {
          console.log('Created new table in token repo');
        }
      });
      db.query(query, values, function (error, token) {
        if (error) {
          console.log('Error storing token: ', error);
          callback(['ERR_DATABASE'], null);
        } else {
          console.log('Successfully stored new token: ', token);
          callback([], token);
        }
      });
    },

    getToken: function (token, callback) {
      const query = 'SELECT * FROM tokens WHERE token = ? LIMIT 1';
      const values = [token.token];
      db.query(query, values, function (error, token) {
        if (error) {
          console.log('Error retreiving token from db: ', error);
          callback(['ERR_DATABASE'], null);
        } else {
          console.log('Got token from database: ', token);
          callback([], token);
        }
      });
    },
  };
};
