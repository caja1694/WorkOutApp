const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'mysql',
  password: 'theRootPassword',
  database: 'webAppDatabase',
  port: '3307',
});

module.exports = connection;
