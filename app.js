// Задание 1 
// Скачайте и подключите модули mongodb и mssql. Создайте базу данных. Создайте приложение и 
// сконфигурируйте подключение к БД. Протестируйте примеры. 
 
// Задание №2 
// Создайте форму регистрации. На серверной стороне реализуйте логику, которая будет возвращать 
// пользователю страницу регистрации. И полученные данные с формы записывать в БД. 
// Поэкспериментируйте с разными БД. 

var express = require('express');
var twig = require('twig');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');

var index = require('./routes/index');
var deleteItem = require('./routes/delete');
var update = require('./routes/update');
var news = require('./routes/news');
var about = require('./routes/about');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({keys: ['montesuma']}));
app.use(express.static(path.join(__dirname, 'public')));

//pages
app.use('/', index);
app.use('/news', news);
app.use('/about', about);
//user operations
app.use('/delete', deleteItem);
app.use('/update', update);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);

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
  res.render('error', { title: err.message });
});

module.exports = app;
