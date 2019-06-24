var express = require('express');
var router = express.Router();

router.post('/china/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("SELECT * FROM china_geographic;" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        }else{
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        }
    });
});

router.post('/china/update/', function(req,res,next){
    let body = req.body;
    let global_error = null;
    body.forEach((geo)=>{
        let query = "UPDATE china_geographic SET ";
        Object.keys(geo).forEach((key)=>{
            if(key!=="id"){
                if(geo[key]===""||geo[key]==="null"||geo[key]===null){
                    query = query + key + " = null,";
                }
                else{
                    query = query + key + " = '"+geo[key]+"',";
                }
            }
        });
        query = query.slice(0,-1);
        query = query + " WHERE id = "+geo.id+";";
        console.log(query);
        res.locals.pool.query(query, function (error, results, fields) {
            if(error){
                global_error = error;
            }
        });
    });
    if(global_error){
        res.send(JSON.stringify({"status": 500, "error": global_error, "response": null}));
    }
    else{
        res.send(JSON.stringify({"status": 200, "error": null, "response": null}));
    }
});

router.post('/china/add/', function(req, res, next) {
    let body = req.body;
    let query = "INSERT INTO china_geographic (";
    Object.keys(body).forEach((key)=>{
        if(key!=="id"){
            query = query + key + ",";
        }
    });
    query = query.slice(0,-1);
    query = query + ") VALUES (";
    Object.keys(body).forEach((key)=>{
        if(key!=="id"){
            const value = body[key]==null||body[key]===""?"null":"'"+ body[key] + "'";
            query = query +value+",";
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

router.post('/china/delete/', function(req, res, next) {
    let body = req.body;
    console.log(body);
    res.locals.pool.query("DELETE FROM china_geographic WHERE id = "+body.id+"" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        }
    });
});
module.exports = router;