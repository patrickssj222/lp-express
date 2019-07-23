    var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require("mysql");
var cors = require('cors');
var bodyParser = require('body-parser');
var pdf = require('html-pdf');
var pdfTemplate = require('./documents');
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
    connectionLimit: 5,
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
var geographicRouter = require('./routes/geographic');
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/constants', constantsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/business',businessRouter);
app.use('/api/geographic',geographicRouter);


app.post('/create-pdf',(req,res)=>{
    pdf.create(pdfTemplate(req.body),{}).toFile('result.pdf',(err)=>{
        if(err){
            res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
        }
        res.send(JSON.stringify({"status": 200, "error": null, "response": null}));
    });
});



app.get('/fetch-pdf',(req,res)=>{
    res.sendFile(path.join(__dirname, 'result.pdf'));
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    //
    app.get('*', (req, res) => {
        res.sendfile(path.join(__dirname = 'client/build/index.html'));
    })
}

module.exports = app;
