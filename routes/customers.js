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

router.post('/contact/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("SELECT * FROM customer_emergency_contact WHERE customer_id = "+body.id+"" , function (error, results, fields) {
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
    res.locals.pool.query("SELECT b.*, s.type AS service_type, s.name AS service_name FROM business b INNER JOIN service_constants s ON b.service_constants_id = s.id WHERE customer_id = "+body.id+"" , function (error, results, fields) {
        console.log("Result", results);
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
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
            if(body[key]===""||body[key]==="null"||body[key]===null){
                query = query + "null,";
            }
            else{
                query = query + "'"+ body[key] + "',";
            }
        }
    });
    query = query.slice(0,-1);
    query = query + "); ";
    res.locals.pool.query(query, function (error, results, fields) {
        if(error){
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
        if(key!=="id" && key!=="creation_time" && key!=="emergency_contact"){
            if(key!=="id" && key!=="emergency_contact"){
                if(body[key]===""||body[key]==="null"||body[key]===null){
                    query = query + key + " = null,";
                }
                else{
                    query = query + key + " = '"+body[key]+"',";
                }
            }
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
            body.emergency_contact.forEach((contact)=>{
                query = "";
                query = query + "UPDATE customer_emergency_contact SET ";
                Object.keys(contact).forEach((key)=>{
                    if(key!=="id"){
                        query = query + key + " = '"+contact[key]+"',";
                    }
                });
                query = query.slice(0,-1);
                query = query + " WHERE id = "+contact.id+";";
                res.locals.pool.query(query, function (error, results, fields) {
                    if(error){
                        console.log(error);
                        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                        //If there is error, we send the error in the error section with 500 status
                    }
                });
            });
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/geo/china/', function(req, res, next) {
    let body = req.body;
    let value = {};
    res.locals.pool.query("SELECT * FROM region;" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            value.region ={};
            results.forEach((r)=>{
                value[r.id] = r;
                value[r.id].province = {};
            });
            res.locals.pool.query("SELECT * FROM province;" , function (error, results, fields) {
                if(error){
                    res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                    //If there is error, we send the error in the error section with 500 status
                } else {
                    results.forEach((p)=>{
                        value[p.region_id].province[p.id] = p;
                        value[p.region_id].province[p.id].city = {};
                    });
                    res.locals.pool.query("SELECT * FROM city;" , function (error, results, fields) {
                        if(error){
                            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                            //If there is error, we send the error in the error section with 500 status
                        } else {
                            results.forEach((c)=>{
                                value[c.region_id].province[c.province_id].city[c.id] = c;
                            });
                            res.send(JSON.stringify({"status": 200, "error": null, "response": value}));
                            //If there is no error, all is good and response is 200OK.
                        }
                    });
                }
            });
        }
    });
});

router.post('/city/china/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("SELECT * FROM city WHERE id = "+body.id+";" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        }else{
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        }
    });
});

module.exports = router;