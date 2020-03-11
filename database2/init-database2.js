const Sequelize = require('sequelize')
const sequelize = new Sequelize('webAppDatabase2', 'root', 'theRootPassword',{
	host: 'database2',
	dialect: 'mysql'
})

const account = sequelize.define('account', {
    username: Sequelize.TEXT,
    email: Sequelize.TEXT,
    password: Sequelize.TEXT
})
sequelize.sync()
account.create({username: "Jacob", email: "jacob.carlquist@gmail.com", password: "jacob"})
.then(function(createdAccount){
    console.log("CREATED ACCOUNT: ", createdAccount)
})
.catch(function(error){
    console.log("DATABASE ERROR", error)
})

console.log("******************************** \n ***********************")
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });