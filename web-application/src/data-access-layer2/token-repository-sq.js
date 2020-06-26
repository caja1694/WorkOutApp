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
          if (error.parent.code == 'ER_DUP_ENTRY') {
            console.log('ER_DUP_ENTRY');
            callback(['ERR_ALREADY_SIGNED_IN'], null);
          } else {
            console.log('ERROR in storeToken: ', error);
            callback(['ERR_DATABASE'], null);
          }
        });
    },
    getToken: function (token, callback) {
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
    getAllTokens: function (callback) {
      const table = getTokenTableModel();
      table
        .findAll()
        .then(function (tokens) {
          const tokensToReturn = [];
          for (let i = 0; i < tokens.length; i++) {
            console.log('Token: ', tokens[i].dataValues);
            tokensToReturn.push(tokens[i].dataValues);
          }
          callback([], tokensToReturn);
        })
        .catch(function (error) {
          console.log('Error getting all tokens: ', error);
          callback(['ERR_DATABASE'], null);
        });
    },
    removeToken: function (token, callback) {
      const table = getTokenTableModel();
      table
        .destroy({ where: { token: token.token } })
        .then(function (result) {
          console.log('Token: ' + result + 'was destroyed');
          callback([]);
        })
        .catch(function (error) {
          console.log('Error destroying token: ', error);
          callback(['ERR_DATABASE']);
        });
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
