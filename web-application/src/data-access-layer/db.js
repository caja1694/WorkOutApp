const mysql = require('mysql');

const connection = new mysql.createConnection({
  host: 'database',
  user: 'root',
  password: 'theRootPassword',
});

module.exports = connection;
