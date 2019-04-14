var express = require('express');
var router = express.Router();

router.post('/all/', function(req, res, next) {
    res.locals.pool.query("SELECT * FROM business" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/one/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("SELECT * FROM business WHERE id = "+body.id+"" , function (error, results, fields) {
        if(error){
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
        if(key!=="id"){
            query = query + key + " = '"+body[key]+"',";
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