const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');

const session = require('express-session');

const redis = require('redis');
const redisClient = redis.createClient({ host: 'redis-database' });
const redisStore = require('connect-redis')(session);

const awilix = require('awilix');
const container = awilix.createContainer();

// Account container
//PL
const accountRouterFun = require('../presentation-layer/routers/account-router');
container.register('accountRouter', awilix.asFunction(accountRouterFun));

//BLL
const accountManagerFun = require('../business-logic-layer/account-manager');
const accoutValidatorFun = require('../business-logic-layer/account-validator');
container.register('accountManager', awilix.asFunction(accountManagerFun));
container.register('accountValidator', awilix.asFunction(accoutValidatorFun));

// DAL
// Layer1
const accountRepoFun = require('../data-access-layer/account-repository');

// Layer2
const accountRepoSequelize = require('../data-access-layer2/account-repository-sq');

// Article container
// PL
const articleRouterFun = require('../presentation-layer/routers/article-router');
container.register('article-router', awilix.asFunction(articleRouterFun));

// BLL
const articleManagerFun = require('../business-logic-layer/article-manager');
container.register('articleManager', awilix.asFunction(articleManagerFun));

// DAL
// Layer 1
const articleRepFun = require('../data-access-layer/article-repository');
// Layer 2
const articleRepSequelize = require('../data-access-layer2/article-repository-sq');

// Workouts container
// PL
const myWorkoutsRouterFun = require('../presentation-layer/routers/workouts-router');
container.register('myWorkoutsRouter', awilix.asFunction(myWorkoutsRouterFun));
// BLL
const myWorkoutManagerFun = require('../business-logic-layer/workouts-manager');
container.register('myWorkoutManager', awilix.asFunction(myWorkoutManagerFun));
// DAL
// Layer 1
const myWorkoutsRepoFun = require('../data-access-layer/workouts-repository');
// Layer 2
const myWorkoutRepoSequelize = require('../data-access-layer2/workouts-repository-sq');
// Rest-api container
const restApiRouterFun = require('../REST-API/rest-api');
container.register('rest-api', awilix.asFunction(restApiRouterFun));

// Tokens
const tokenRepoFun = require('../data-access-layer/token-repository');
const tokenRepoSequelize = require('../data-access-layer2/token-repository-sq');

// AddLayer1 or 2 to add the wanted dependecies
addLayer1(container);

// Resolve
const myWorkoutsRouter = container.resolve('myWorkoutsRouter');
const restApiRouter = container.resolve('rest-api');
const accountRouter = container.resolve('accountRouter');
const articleRouter = container.resolve('article-router');

function addLayer1(container) {
  container.register('accountRepo', awilix.asFunction(accountRepoFun));
  container.register('myWorkoutRepo', awilix.asFunction(myWorkoutsRepoFun));
  container.register('articleRepo', awilix.asFunction(articleRepFun));
  container.register('tokenRepo', awilix.asFunction(tokenRepoFun));
}

function addLayer2(container) {
  container.register('accountRepo', awilix.asFunction(accountRepoSequelize));
  container.register('articleRepo', awilix.asFunction(articleRepSequelize));
  container.register(
    'myWorkoutRepo',
    awilix.asFunction(myWorkoutRepoSequelize)
  );
  container.register('tokenRepo', awilix.asFunction(tokenRepoSequelize));
}

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    type: 'session',
    store: new redisStore({ client: redisClient }),
  })
);

// Setup express-handlebars.
app.set('views', path.join(__dirname, 'views'));

app.engine(
  'hbs',
  expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'layouts'),
  })
);

// Handle static files in the public folder.
app.use(express.static(path.join(__dirname, 'public')));

// Get client side js files.
app.get('/public/createWorkout.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'createWorkout.js'));
});

// Attach all routers.
app.use('/', articleRouter);
app.use('/accounts', accountRouter);
app.use('/myWorkouts', myWorkoutsRouter);
app.use('/rest-api', restApiRouter);

// Start listening for incoming HTTP requests!
app.listen(8080, function () {
  console.log('Running on 8080!');
});
