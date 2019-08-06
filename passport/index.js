const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

passport.use('local-login', new Strategy(
    {passReqToCallback: true},
    function(req, username, password, done) {
        req.res.locals.pool.query("SELECT * FROM user WHERE username = '"+ username + "' AND password = '"+ password + "'" , function (error, results, fields) {
            if (error){
                done("Incorrect Email Address or Password");
            } else {
                const user = {
                    username: results[0].username,
                    role: results[0].role,
                }
                const token = jwt.sign(user, 'secret_key');
                done(null, results, token);
            }
        })
    })
);

module.exports = passport;