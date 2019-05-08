var express = require('express');
var router = express.Router();

router.post('/all/', function(req, res, next) {
    res.locals.pool.query("SELECT * FROM customer" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/business/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("SELECT * FROM business WHERE student_id = "+body.id+"" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/add/one/', function(req,res,next){
    let body = req.body;
    let query = "INSERT INTO customer (";
    Object.keys(body).forEach((key)=>{
        if(key!=="id" && key!=="emergency_contact"){
            query = query + key + ",";
        }
    });
    query = query.slice(0,-1);
    query = query + ") VALUES (";
    Object.keys(body).forEach((key)=>{
        if(key!=="id" && key!=="emergency_contact"){
            query = query + "'"+ body[key] + "',";
        }
    });
    query = query.slice(0,-1);
    query = query + "); ";
    res.locals.pool.query(query, function (error, results, fields) {
        console.log(query);
        if(error){
            console.log(error);
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            body.emergency_contact.forEach((contact)=>{
                query = "";
                query = query + "INSERT INTO customer_emergency_contact (";
                Object.keys(contact).forEach((key)=>{
                    if(key!=="id"){
                        query = query + key + ",";
                    }
                });
                query = query + "customer_id";
                query = query + ") VALUES (";
                Object.keys(contact).forEach((key)=>{
                    if(key!=="id"){
                        query = query + "'"+ contact[key] + "',";
                    }
                });
                query = query+ "'"+results.insertId+"'";
                query = query + "); ";
                res.locals.pool.query(query, function (error, results, fields) {
                    if(error){
                        console.log(error);
                        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                        //If there is error, we send the error in the error section with 500 status
                    }
                });
            });
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        }
    });
});


router.post('/update/one/', function(req,res,next){
    let body = req.body;
    let query = "UPDATE customer SET ";
    Object.keys(body).forEach((key)=>{
        if(key!=="id" && key!=="creation_time"){
            query = query + key + " = '"+body[key]+"',";
        }
    });
    query = query.slice(0,-1);
    query = query + " WHERE id = "+body.id+";";
    console.log(query);

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

module.exports = router;