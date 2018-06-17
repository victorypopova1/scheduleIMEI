var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require("express-session");
var flash= require('connect-flash');
var index = require('./routes/index');
var teachers = require('./routes/teachers');
var subjects = require('./routes/subjects');
var classes = require('./routes/classes');
var groups = require('./routes/groups');
var days = require('./routes/days');
var authorization = require('./routes/authorization');
var contactForm = require('./routes/contactForm');
var searchPair = require('./routes/searchPair');
var viewAndEditSession = require('./routes/viewAndEditSession');
var config = require('./config');
var app = express();

app.use(flash());
app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave: true}));

var pp = require('./passport');

//all the good passport stuff are stored here (in pp.js)
pp.init(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', teachers);
app.use('/', subjects);
app.use('/', classes);
app.use('/', groups);
app.use('/', days);
app.use('/', authorization);
app.use('/', contactForm);
app.use('/', searchPair);
app.use('/', viewAndEditSession);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
