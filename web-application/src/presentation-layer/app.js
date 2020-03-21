const path = require('path')
const express = require('express')
const expressHandlebars = require('express-handlebars')

const session = require('express-session');

const redis = require('redis')
const redisClient = redis.createClient({host: 'redis-database'})
const redisStore = require('connect-redis')(session)

const awilix = require('awilix')
const container = awilix.createContainer()


const accountRepoSequelize = require('../data-access-layer2/account-repository-sq')
const accountRepoFun = require('../data-access-layer/account-repository')
const accountManagerFun = require('../business-logic-layer/account-manager')
const accoutValidatorFun = require('../business-logic-layer/account-validator')
const accountRouterFun = require('../presentation-layer/routers/account-router')
const articleRouterFun = require('../presentation-layer/routers/article-router')
const myWorkoutsRouterFun = require('../presentation-layer/routers/my-workouts-router')
const articleManagerFun = require('../business-logic-layer/article-manager')
const articleRepFun = require('../data-access-layer/article-repository')
const myWorkoutManagerFun = require('../business-logic-layer/myWorkout-manager')
const myWorkoutsRepoFun = require('../data-access-layer/myWorkout-repository')
const myWorkoutRepoSequelize = require('../data-access-layer2/myWorkout-repository-sq')

const restApiRouterFun = require('../REST-API/rest-api')

container.register('article-router', awilix.asFunction(articleRouterFun))
container.register('articleRepo', awilix.asFunction(articleRepFun))
container.register('articleManager', awilix.asFunction(articleManagerFun))
container.register('myWorkoutsRouter', awilix.asFunction(myWorkoutsRouterFun))
//container.register('accountRepo', awilix.asFunction(accountRepoFun))
container.register('accountRepo', awilix.asFunction(accountRepoSequelize))
container.register('accountManager', awilix.asFunction(accountManagerFun))
container.register('accountValidator', awilix.asFunction(accoutValidatorFun))
container.register('accountRouter', awilix.asFunction(accountRouterFun))
container.register('myWorkoutManager', awilix.asFunction(myWorkoutManagerFun))
//container.register('myWorkoutRepo', awilix.asFunction(myWorkoutsRepoFun))
container.register('myWorkoutRepo', awilix.asFunction(myWorkoutRepoSequelize))
container.register('rest-api', awilix.asFunction(restApiRouterFun))

const accountRouter = container.resolve('accountRouter')
const articleRouter = container.resolve('article-router')
const myWorkoutsRouter = container.resolve('myWorkoutsRouter')
const restApiRouter = container.resolve('rest-api')

const app = express()

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Setup session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new redisStore({ client: redisClient})
  }))

// Setup express-handlebars.
app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', expressHandlebars({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'layouts')
}))

// Handle static files in the public folder.
app.use(express.static(path.join(__dirname, 'public')))

// Get client side js files. 
app.get('/public/createWorkout.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'createWorkout.js'));
});

// Attach all routers.
app.use('/', articleRouter)
app.use('/accounts', accountRouter)
app.use('/myWorkouts', myWorkoutsRouter)
app.use('/rest-api', restApiRouter)

// Start listening for incoming HTTP requests!
app.listen(8080, function(){
	console.log('Running on 8080!')
})