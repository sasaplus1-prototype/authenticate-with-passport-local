'use strict';

const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new LocalStrategy({
    usernameField: 'user',
    passwordField: 'pass',
    passReqToCallback: true,
    session: false,
  }, function(req, username, password, done) {
    if (username === 'user' && password === 'pass') {
      done(null, {
        id: 10293,
        isLoggedin: true,
        message: 'Hello',
      });
    } else {
      done(null, false);
    }
  })
);

//------------------------------------------------------------------------------

const express = require('express'),
      expressSession = require('express-session'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('x-powered-by', false);

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

//------------------------------------------------------------------------------

app.get('/', function(req, res) {
  res.render('index', {
    data: req.user || 'unknown',
  });
});

app.post('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

app.listen(3000, function() {
  console.log('server starting at 127.0.0.1:3000');
});
