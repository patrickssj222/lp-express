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
module.exports = router;