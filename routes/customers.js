var express = require('express');
var router = express.Router();

//Get All Customer
router.post('/all/', function(req, res, next) {
    res.locals.pool.query("SELECT c.*, u.name AS user_name, u.id AS created_by FROM customer c INNER JOIN customer_user cu ON cu.customer_id = c.id INNER JOIN user u ON cu.user_id = u.id" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

//Find customer
router.post('/find/', function(req, res, next) {
    let body = req.body;
    console.log(body);
    let query = "SELECT c.*, u.name AS user_name, u.id AS created_by " +
        "FROM customer c " +
        "INNER JOIN customer_user cu " +
        "ON cu.customer_id = c.id " +
        "INNER JOIN user u " +
        "ON cu.user_id = u.id " +
        "WHERE ";
    Object.keys(body).forEach((key)=>{
       query = query+ "c."+key+" = '"+body[key]+"' AND ";
    });
    query = query.slice(0,-5);
    query = query+";";
    console.log(query);
    res.locals.pool.query(query, function (error, results, fields) {
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

router.post('/delete/customer_user', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("DELETE FROM customer_user WHERE customer_id = "+body.id+"" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
        }
    });
});

router.post('/add/customer_user', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("INSERT INTO customer_user (customer_id, user_id) VALUES ("+body.customer_id+", "+body.user_id+");" , function (error, results, fields) {
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
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        }
    });
});

router.post('/delete/force/', function(req, res, next) {
    let body = req.body;
    res.locals.pool.query("DELETE FROM customer_user WHERE customer_id = "+body.id+"" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        } else {
            res.locals.pool.query("DELETE FROM customer WHERE id = "+body.id+"" , function (error, results, fields) {
                if(error){
                    res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                }
                else{
                    res.locals.pool.query("DELETE FROM customer_user WHERE customer_id = "+body.id+"" , function (error, results, fields) {
                        if(error){
                            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                        }
                        else{
                            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                        }
                    });
                }
            });
        }
    });
});

router.post('/add/', function(req,res,next){
    let body = req.body;
    let query = null;
    if(body.passport_number!=="" || body.passport_number!==null || body.passport_number!=="null"){
        query = "SELECT c.id, cu.user_id FROM customer c INNER JOIN customer_user cu ON c.id = cu.customer_id WHERE c.passport_number = '"+body.passport_number+"';";
        res.locals.pool.query(query, function (error, results, fields) {
            if(error){
                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                //If there is error, we send the error in the error section with 500 status
            }
            else{
                if(results.length>0) {
                    if(results[0].user_id === body.created_by){
                        res.send(JSON.stringify({"status": 500, "error": {message:"Customer already exists under your name."}, "response": null}));
                    }
                    else{
                        query = "INSERT INTO customer_user (customer_id, user_id) VALUES (" + results[0].id + ", " + body.created_by + ");"
                        res.locals.pool.query(query, function (error, results, fields) {
                            if(error){
                                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                            }
                            else{
                                res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                            }
                        });
                    }
                }
                else{
                    query = "INSERT INTO customer (";
                    Object.keys(body).forEach((key)=>{
                        if(key!=="id" && key!=="emergency_contact" && key!=="created_by" && key!=="user_name" && key!=="user_role"){
                            query = query + key + ",";
                        }
                    });
                    query = query.slice(0,-1);
                    query = query + ") VALUES (";
                    Object.keys(body).forEach((key)=>{
                        if(key!=="id" && key!=="emergency_contact" && key!=="created_by" && key!=="user_name" && key!=="user_role"){
                            if(body[key]===""||body[key]==="null"||body[key]===null){
                                query = query + "null,";
                            }
                            else{
                                query = query + "'"+ body[key] + "',";
                            }
                        }
                    });
                    query = query.slice(0,-1);
                    query = query + ");";

                    res.locals.pool.query(query, function (error, results, fields) {
                        if(error){
                            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                            //If there is error, we send the error in the error section with 500 status
                        } else {
                            /*body.emergency_contact.forEach((contact)=>{
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
                            });*/
                            query = "SELECT LAST_INSERT_ID();";
                            res.locals.pool.query(query, function (error, results, fields) {
                                if(error){
                                    console.log(error);
                                    res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                                    //If there is error, we send the error in the error section with 500 status
                                }
                                else{
                                    query = "INSERT INTO customer_user (customer_id, user_id) VALUES(LAST_INSERT_ID(),"+body.created_by+");";
                                    res.locals.pool.query(query, function (error, results, fields) {
                                        if(error){
                                            console.log(error);
                                            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                                            //If there is error, we send the error in the error section with 500 status
                                        }
                                        else{
                                            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            }
        });
    }
    else{
        query = "INSERT INTO customer (";
        Object.keys(body).forEach((key)=>{
            if(key!=="id" && key!=="emergency_contact" && key!=="created_by" && key!=="user_name" && key!=="user_role"){
                query = query + key + ",";
            }
        });
        query = query.slice(0,-1);
        query = query + ") VALUES (";
        Object.keys(body).forEach((key)=>{
            if(key!=="id" && key!=="emergency_contact" && key!=="created_by" && key!=="user_name" && key!=="user_role"){
                if(body[key]===""||body[key]==="null"||body[key]===null){
                    query = query + "null,";
                }
                else{
                    query = query + "'"+ body[key] + "',";
                }
            }
        });
        query = query.slice(0,-1);
        query = query + ");";

        res.locals.pool.query(query, function (error, results, fields) {
            if(error){
                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                //If there is error, we send the error in the error section with 500 status
            } else {
                /*body.emergency_contact.forEach((contact)=>{
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
                });*/
                query = "SELECT LAST_INSERT_ID();";
                res.locals.pool.query(query, function (error, results, fields) {
                    if(error){
                        console.log(error);
                        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                        //If there is error, we send the error in the error section with 500 status
                    }
                    else{
                        query = "INSERT INTO customer_user (customer_id, user_id) VALUES(LAST_INSERT_ID(),"+body.created_by+");";
                        res.locals.pool.query(query, function (error, results, fields) {
                            if(error){
                                console.log(error);
                                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                                //If there is error, we send the error in the error section with 500 status
                            }
                            else{
                                res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                            }
                        });
                    }
                });

            }
        });
    }

});

router.post('/update/one/', function(req,res,next){
    let body = req.body;
    let query = "UPDATE customer SET ";
    Object.keys(body).forEach((key)=>{
        if(key!=="id" && key!=="creation_time" && key!=="emergency_contact" && key!=="created_by" && key!=="user_name" && key!=="user_role"){
            if(key!=="id" && key!=="emergency_contact" && key!=="update_time" && key!=="created_by" && key!=="user_name" && key!=="user_role"){
                if(body[key]===""||body[key]==="null"||body[key]===null){
                    query = query + key + " = null,";
                }
                else{
                    query = query + key + " = '"+body[key]+"',";
                }
            }
            else if(key==="update_time"){
                var d = new Date();
                d = new Date(d.getTime() - 3000000);
                var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
                query = query + key + " = '"+date_format_str+"',";
            }
        }
    });
    query = query.slice(0,-1);
    query = query + " WHERE id = "+body.id+";";

    res.locals.pool.query(query, function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
        } else {
            /*body.emergency_contact.forEach((contact)=>{
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
            });*/
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
    res.locals.pool.query("SELECT * FROM china_geographic WHERE id = "+body.id+";" , function (error, results, fields) {
        if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        }else{
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        }
    });
});

module.exports = router;