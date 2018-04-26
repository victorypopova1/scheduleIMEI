(function (pp) {

    var passport        = require('passport'),
        LocalStrategy   = require('passport-local').Strategy,
        bcrypt          = require('bcrypt'),
        sqlite3         = require('sqlite3'),
        config          = require('./config'),
        db              = new sqlite3.Database(config.dbconnection);

    //init passport functions
    pp.init = function (app) {

        passport.serializeUser(function (user, done) {
            done(null, user.username);
        }); //end serialize

        passport.deserializeUser(function (id, done) {
            var sql = "select * from users where username='" + id + "'";
            db.get(sql, function (err, row) {
                if (err) {
                    throw (err);
                }
                var user = {};
                user.username = row.username;
                user.created = row.created;
                done(err, user);
            });
        }); //end deserialize

        //register new user strategy
        passport.use('local-signup', new LocalStrategy({
                usernameField : 'username',
                passwordField : 'password',
                passReqToCallback : true
            },
            function (req, username, password, done) {
                var sql = "select * from users where username='" + username + "'";
                db.get(sql, function (err, row) {
                    if (err) {
                        return done(err);
                    }
                    if (row) { //then there is a user here already
                        return done(null, false, req.flash('signupMessage', 'Username not available'));
                    } else { //no entry, create user
                        // if there is no user with that email
                        // create the user
                        var user = {};
                        user.username = username;
                        bcrypt.hash(password, 10, function (err, hash) { //hash the password and save to the sqlite database
                            if (err) {
                                throw err;
                            }
                            user.password = hash;
                            var insertsql = "insert into users (username, password) values('" + user.username + "', '" + user.password + "');";
                            db.run(insertsql, function (err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, user);
                            }); //end run
                        });//end hash
                    }//end else
                }); //end db.get
            }));//end passport use signup

        //login strategy
        passport.use('local-login', new LocalStrategy({
                usernameField : 'username',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function (req, username, password, done) {
                var sql = "select * from users where username='" + username + "'";
                db.get(sql, function (err, row) {
                    if (err) {
                        return done(err);
                    } //end err
                    if (!row) {
                        return done(null, false, req.flash('loginMessage', 'User not found.'));
                    } //end !row
                    var user = {};
                    user.username = row.username;
                    user.created = row.created;
                    bcrypt.compare(password, row.password, function (err, res) {
                        if (res) {
                            return done(null, user);
                        } else {
                            return done(null, false, req.flash('loginMessage', 'Wrong password.'));
                        }
                    }); //end compare
                });//end db.get
            })); //end local-login

        app.use(passport.initialize());
        app.use(passport.session());
    }; //end init
})(module.exports);