var express = require('express');
var router = express.Router();

/* GET users listing. */

router.post('/', function(req, res, next) {
    let data = req.body;
    console.log("data:",data);
    res.locals.pool.query("SELECT * FROM user WHERE username = '"+ data.user + "' AND password = '"+ data.password + "'" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/all/', function(req, res, next) {
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

router.post('/update/', function(req,res,next){
    let body = req.body;
    let query = "UPDATE user SET ";
    Object.keys(body).forEach((key)=>{
        if(key!=="id" && key!=="creation_time"){
            if(body[key]===""||body[key]==="null"||body[key]===null){
                query = query + key + " = null,";
            }
            else{
                query = query + key + " = '"+body[key]+"',";
            }
        }
    });
    query = query.slice(0,-1);
    query = query + " WHERE id = "+body.id+";";

    res.locals.pool.query(query, function (error, results, fields) {
        if(error){
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

module.exports = router;