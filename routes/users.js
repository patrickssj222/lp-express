var express = require('express');
var router = express.Router();
var passport = require('../passport');
// checkAuth is used for compapre tokens
var checkAuth = require('../middleware/check-auth');
/* GET users listing. */

router.post('/', function(req, res, next){
    passport.authenticate('local-login', function(error, user, info){
        if (error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            req.session.userID = user[0].id;
            req.session.user = user[0].name;
            req.session.username = user[0].username;
            req.session.role = user[0].role;
            req.session.password = user[0].password;

            res.cookie('JWT', info, { httpOnly: true, secure: true });
            res.send(JSON.stringify({"status": 200, "error": null, "response": user}));
            //If there is no error, all is good and response is 200OK.
        }
    })(req, res, next);
});

router.post('/all/', function(req, res, next) {
    let data = req.body;
    console.log("data:",data);
    res.locals.pool.query("SELECT * FROM user" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/add/', function(req, res, next) {
    let body = req.body;
    let query = "INSERT INTO user (";
    Object.keys(body).forEach((key)=>{
        if(key!=="id"){
            query = query + key + ",";
        }
    });
    query = query.slice(0,-1);
    query = query + ") VALUES (";
    Object.keys(body).forEach((key)=>{
        if(key!=="id"){
            const value = body[key]==null||body[key]===""?null:"'"+ body[key] + "'";
            console.log(key,": ",value);
            query = query + value+",";
        }
    });
    query = query.slice(0,-1);
    query = query + ");";
    console.log("QUERY!! :",query);
    res.locals.pool.query(query , function (error, results, fields) {
        if(error){
            console.log(error);
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/delete/', function(req, res, next) {
    let data = req.body;
    console.log("data:",data);
    res.locals.pool.query("DELETE FROM user WHERE id = "+data.id+";" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/check/', function(req, res, next) {
    if (req.session.userID){
        res.locals.pool.query("SELECT * FROM user WHERE username = '"+ req.session.username + "' AND password = '"+ req.session.password + "'", function (error, results, fields) {
            if(error){
                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                //If there is error, we send the error in the error section with 500 status
            } else {
                
                res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                //If there is no error, all is good and response is 200OK.
            }
        });
    } else {
        res.send(JSON.stringify({"status": 200, "error": null}));
    }
});

router.post('/signout/', function(req, res, next) {
    req.session.destroy(err => {
        if (err){
            res.send(JSON.stringify({"status": 500}));
        } else {
            res.clearCookie('La Promesse Inc');
            res.send(JSON.stringify({"status": 200}));
        }
    })
});

module.exports = router;