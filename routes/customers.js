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

router.post('/update/one/', function(req,res,next){
    let data = req.body;
    console.log(data);
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