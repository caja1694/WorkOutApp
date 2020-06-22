const Sequelize = require('sequelize');
const db = new Sequelize('webAppDatabase2', 'root', 'theRootPassword', {
  host: 'database2',
  dialect: 'mysql',
});

db.authenticate()
  .then(() => {
    console.log(
      'Connection from token repository has been established successfully.'
    );
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = function (container) {
  return {
    storeToken: function (token, callback) {
      console.log('storeToken', token);
      const table = getTokenTableModel();
      table
        .create({
          token: token.token,
          userId: token.userId,
        })
        .then(function (token) {
          callback([], token);
        })
        .catch(function (error) {
          console.log('Error in token repo: ', error);
          callback(['ERR_DATABASE']);
        });
    },
    getToken: function (token) {
      const table = getTokenTableModel();
      table
        .findOne({
          where: { token: token.token },
        })
        .then(function (token) {
          if (token) {
            callback([], token);
          } else {
            callback(['ERR_TOKEN_MISSING'], null);
          }
        })
        .catch(function (error) {
          console.log('Error in token repo: ', error);
          callback(['ERR_DATABASE']);
        });
      console.log('getToken', token);
    },
  };
};

function getTokenTableModel() {
  return db.define(
    'token',
    {
      token: Sequelize.TEXT,
      userId: Sequelize.TEXT,
    },
    {
      timestamps: false,
    }
  );
}
