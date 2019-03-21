var express = require('express');
var router = express.Router();

/* GET users listing. */

router.post('/price/', function(req, res, next) {
    res.locals.pool.query("SELECT * FROM price_constants" , function (error, results, fields) {
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
        res.locals.pool.query("UPDATE price_constants SET service_fee = "+data.service_fee+", government_fee = "+data.government_fee+", misc_fee = "+data.misc_fee+" WHERE id ="+data.id+";", function (error, results, fields) {
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
module.exports = router;