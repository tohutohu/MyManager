const express = require('express');
const passport = require('passport');
require('dotenv').config({path: __dirname + '/../.env'})
const TwitterStrategy = require('passport-twitter').Strategy;

const MongoManager = require('./MongoManager.js');

const app = express();

let dbUser;

const init = async () => {
  dbUser = await MongoManager.getCollection('user');

  passport.serializeUser(function(user, done){
    done(null, user);
  });

  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'https://manager.to-hutohu.com/auth/twitter/callback'
  },

  function(token, tokenSecret, profile, done){
    dbUser.findOne({username:profile.username}, (err, doc) => {
      if(!doc){
        dbUser.insert(profile);
      }
    });

    process.nextTick(function(){
      return done(null, {id:profile.username, type:'twitter'});
    });
  })
  );

  function isAuth(req, res, next){
    if(!req.isAuthenticated()){
      return next();
    }else{
      res.redirect('https://manager.to-hutohu.com/auth/twitter');
    }
  }

  app.get('/login', isAuth, (req, res, next) => {
    res.render('login');
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/'}));

  app.get('/logout', (req, res, next) => {
    req.logout();
    res.status(200);
    res.send('ログアウトしました');
  }); 
  return app;
};


module.exports = init;
