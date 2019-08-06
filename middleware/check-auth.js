const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, "secret_key", null);
        req.userData = decode;
        next();
    } catch (error){
        return res.send(JSON.stringify({"status": 401, "error": error, "response": null}));
    }
}