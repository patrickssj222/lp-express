var express = require('express');
var router = express.Router();

router.post('/all/', function(req, res, next) {
    res.locals.pool.query("SELECT b.*, s.type AS service_type, s.name AS service_name, w.progress FROM business b INNER JOIN service_constants s ON b.service_constants_id = s.id LEFT JOIN wenan_detail w ON b.id = w.business_id" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            console.log(results);
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/customer/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("SELECT b.*, s.type AS service_type, s.name AS service_name FROM business b INNER JOIN service_constants s ON b.service_constants_id = s.id WHERE b.customer_id = "+body.customer_id+"" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            console.log(results);
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/one/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("SELECT b.*, s.type AS service_type, s.name AS service_name FROM business b INNER JOIN service_constants s ON b.service_constants_id = s.id WHERE b.id = "+body.id+"" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            console.log(results);
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/wenan/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("SELECT * FROM wenan_detail WHERE business_id = "+body.business_id+"" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            console.log(results);
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/add/', function(req, res, next) {
    let body = req.body;
    let query = "INSERT INTO business (";
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

router.post('/wenan/add/', function(req, res, next) {
    let body = req.body;
    let query = "INSERT INTO wenan_detail (";
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
router.post('/update/', function(req, res, next) {
    let body = req.body;
    let query = "UPDATE business SET ";
    Object.keys(body).forEach((key)=>{
        if(key!=="id" && key!=="create_time" && key!=="wenan_detail"){
            if(key ==="update_time"){
                query = query + key + " = '"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"',";
            }
            else{
                if(body[key]===""){
                    query = query + key + " = null,";
                }
                else{
                    query = query + key + " = '"+body[key]+"',";
                }
            }
        }
    });
    query = query.slice(0,-1);
    query = query + "WHERE id = "+body.id+";";
    console.log(query);
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
router.post('/wenan/update/', function(req, res, next) {
    let body = req.body;
    let query = "UPDATE wenan_detail SET ";
    Object.keys(body).forEach((key)=>{
        if(key!=="id" && key!=="create_time"){
            if(key ==="update_time"){
                query = query + key + " = '"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"',";
            }
            else{
                if(body[key]===""){
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

router.post('/payment_transaction/add/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("INSERT INTO payment_transaction(payment_method, amount, comment, business_id) " +
        "VALUES ('"+body.payment_info.payment_method+"','"+body.payment_info.amount+"', '"+body.payment_info.comment+"','"+body.id+"');",function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/payment_transaction/delete/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("DELETE FROM payment_transaction WHERE id = "+body.id+";",function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/payment_transaction/one/', function(req, res, next) {
    let body = req.body;
    const query = "SELECT p.*, b.total_fee " +
        "FROM payment_transaction p INNER JOIN business b " +
        "ON b.id = p.business_id " +
        "WHERE b.id = "+body.id+" " +
        "ORDER BY p.payment_date ASC;";
    res.locals.pool.query( query, function (error, results, fields) {
        if(error){
            console.log(query);
            console.log(error);
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});
module.exports = router;