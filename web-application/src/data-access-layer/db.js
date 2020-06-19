const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'theRootPassword',
  database: 'webAppDatabase',
});

module.exports = connection;
