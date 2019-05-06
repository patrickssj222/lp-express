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
        if(key!=="id"){
            query = query + key + ",";
        }
    });
    query = query.slice(0,-1);
    query = query + ") VALUES (";
    Object.keys(body).forEach((key)=>{
        if(key!=="id"){
            query = query + "'"+ body[key] + "',";
        }
    });
    query = query.slice(0,-1);
    query = query + ");";
    console.log("QUERY!! :",query);
    res.locals.pool.query(query, function (error, results, fields) {
        console.log(query);
        if(error){
            console.log(error);
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            console.log(">>>>");
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});


router.post('/update/one/', function(req,res,next){
    let data = req.body;
    res.locals.pool.query("UPDATE customer SET " +
        "phone = '"+data.phone+"', " +
        "dob = '"+data.dob+"', " +
        "thumb_img = '"+data.thumb_img+"', " +
        "city = '"+data.city+"', " +
        "province = '"+data.province+"', " +
        "region = '"+data.region+"', " +
        "visa_due = '"+data.visa_due+"', " +
        "uci = '"+data.uci+"', " +
        "passport_due = '"+data.passport_due+"', " +
        "passport_number = '"+data.passport_number+"', " +
        "contact_name = '"+data.contact_name+"', " +
        "contact_phone = '"+data.contact_phone+"', " +
        "contact_relationship = '"+data.contact_relationship+"', " +
        "visa_type = '"+data.visa_type+"', " +
        "email = '"+data.email+"', " +
        "chinese_id = '"+data.chinese_id+"', " +
        "landing_time = '"+data.landing_time+"', " +
        "landing_location = '"+data.landing_location+"', " +
        "user = '"+data.user+"', " +
        "gender = '"+data.gender+"', " +
        "wenan = '"+data.wenan+"' " +
        "WHERE id ="+data.id+";", function (error, results, fields) {
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