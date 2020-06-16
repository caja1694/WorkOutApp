const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'database2',
  user: 'root',
  password: 'theRootPassword',
  database: 'webAppDatabase2',
  port: 3307,
});

module.exports = connection;
