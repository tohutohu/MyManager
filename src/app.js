require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const account = require('./Account');

const MongoManager = require('./MongoManager');
const Session = require('express-session');
const MongoStore = require('connect-mongo')(Session);

const api = require('../routes/api');
const app = express();

const init = async () => {
  const port = process.env.PORT || 3334;
  app.listen(port);
  app.set('view engine', 'ejs');

  //セッションの設定
  const db = await MongoManager.getDb();
  const  sessionStore = new MongoStore({db});
  app.use(Session({
    secret: 'cocoro',
    rollong: true,
    store: sessionStore
  })
  );


  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://' + req.headers.host);

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  function isAuth(req, res, next){
    if(req.isAuthenticated() && req.user.id === 'to_hutohu'){
      return next();
    }else{
      res.redirect('https://manager.to-hutohu.com/auth/twitter');
    }
  }

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  const accountApp = await account();
  app.use(accountApp);

  app.use(isAuth);
  app.use('/api', await api());
  
  const push = await MongoManager.getCollection('Push')
  app.post('/api/register-push', (req, res) => {
    push.insertOne(req.body, () => {
      res.json({ok: true})
    })
  })

  app.use(express.static(path.resolve(__dirname + '/../client/dist')))
  app.get('/*', (a, b) => b.sendFile(path.resolve(__dirname + '/../client/dist/index.html')));

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });


  // start day tasks
  require('../tasks/BirthDayNotify.js').start()
  require('../tasks/Diary.js').start()
  require('../tasks/TrelloArchive.js').start()
};
init();
