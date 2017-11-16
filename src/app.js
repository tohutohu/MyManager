require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const account = require('./Account');

const webpush = require('web-push')

const GCM_API_KEY = process.env.GCM_API_KEY
webpush.setGCMAPIKey(GCM_API_KEY)

const CronJob = require('cron').CronJob;

const MongoManager = require('./MongoManager');
const Session = require('express-session');
const MongoStore = require('connect-mongo')(Session);

const api = require('../routes/api');
const app = express();
const t = require('./Trello');
const moment = require('moment');
let Trello;

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

  app.get('/api/push/test', (req, res) => {
    push.find({}).toArray((err, docs) => {
      docs.forEach(doc => {
        const pushOption = {
          endpoint: doc.endpoint,
          keys: {
            p256dh: doc.publicKey,
            auth: doc.authSecret
          }
        }

        const message = JSON.stringify({
          title: 'test',
          body: 'poyo',
          link: 'https://manager.to-hutohu.com'
        })

        webpush.sendNotification(pushOption, message)
      })
      res.json({ok:'ok'})
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
  Trello = await MongoManager.getCollection('Trello');

  const dayTasks = new CronJob({
    cronTime: '55 23 * * *',
    onTick: function () {
      t.get('/1/list/57dd650424d5552396a9a18c/cards', (err, data) => {
        const po = {};
        po.date = moment().format('YYYY-MM-DD');
        po.number = data.length;
        po.tasks = data;

        Trello.insertOne(po, () => {

          t.post('/1/lists/57dd650424d5552396a9a18c/archiveAllCards', () => {});
        });
      });
    },
    start: false
  });
  dayTasks.start();

};
init();
