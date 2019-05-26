var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require("mysql");
var cors = require('cors');
var bodyParser = require('body-parser');
require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));
//production mode


//By Pass CORS
app.use(cors());
//Database connection
console.log(process.env.INSTANCE_CONNECTION_NAME);
var db_config = {
    user: process.env.SQL_USER,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD
};
if (process.env.INSTANCE_CONNECTION_NAME) {
    db_config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

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
var businessRouter = require('./routes/business');
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/constants', constantsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/business',businessRouter);
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    //
    app.get('*', (req, res) => {
        res.sendfile(path.join(__dirname = 'client/build/index.html'));
    })
}
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

/*const port = process.env.PORT || 5000;
app.listen(port, (req, res) => {
    console.log( `server listening on port: ${port}`);
});*/

module.exports = app;
