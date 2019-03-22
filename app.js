var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require("mysql");
var cors = require('cors');
var bodyParser = require('body-parser')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//By Pass CORS
app.use(cors());
//Database connection
var db_config = {
    host     : '23.229.194.226',
    user     : 'remote_access',
    password : 'Lp_147896325',
    database: 'lp_base',
};

app.use(function(req, res, next){
    res.locals.pool = mysql.createPool(db_config);
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var constantsRouter = require('./routes/constants');
var customersRouter = require('./routes/customers');
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/constants', constantsRouter);
app.use('/api/customers', customersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
