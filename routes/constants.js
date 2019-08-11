var express = require('express');
var router = express.Router();

/* GET users listing. */

router.post('/price/', function(req, res, next) {
    res.locals.pool.query("SELECT * FROM service_constants" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/price/update/', function(req,res,next){
    let body = req.body;
    let success = true;
    for(let i=0; i<body.length; i++){
        const data = body[i];
        res.locals.pool.query("UPDATE service_constants SET type='"+data.type+"', service_fee = "+data.service_fee+", government_fee = "+data.government_fee+", misc_fee = "+data.misc_fee+", copywrite_percentage = '"+data.copywrite_percentage+"' WHERE id ="+data.id+";", function (error, results, fields) {
            if(error){
                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                //If there is error, we send the error in the error section with 500 status
                success = false;
            }
            else{
                console.log("success - ", data);
            }
        });
    }
    if(success){
        res.send(JSON.stringify({"status": 200, "error": null, "response": null}));
    }
});

router.post('/price/delete/', function(req,res,next){
    let body = req.body;
    res.locals.pool.query("DELETE FROM service_constants WHERE id ="+body.id+";", function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        }
        else{
            res.send(JSON.stringify({"status": 200, "error": null, "response": null}));
        }
    });
});

router.post('/price/add/', function(req,res,next){
    let body = req.body;
    let query = "INSERT INTO service_constants (";
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
    res.locals.pool.query(query, function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        }
        else{
            res.send(JSON.stringify({"status": 200, "error": null, "response": null}));
        }
    });
});
module.exports = router;