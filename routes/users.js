var express = require('express');
var router = express.Router();

/* GET users listing. */

router.post('/', function(req, res, next) {
    let data = req.body;
    console.log("data:",data);
    res.locals.pool.query("SELECT * FROM user WHERE account = '"+ data.user + "' AND password = '"+ data.password + "'" , function (error, results, fields) {
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