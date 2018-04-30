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
            done(null, user.username, user.lastname, user.firstname,user.type_user,user.email);
        }); //end serialize

        passport.deserializeUser(function (id, done) {
            var sql = "select * from users where username='" + id + "'";
            db.get(sql, function (err, row) {
                if (err) {
                    throw (err);
                }
                var user = {};
                user.username = row.username;
                user.lastname = row.lastname;
                user.firstname = row.firstname;
                user.type_user = row.type_user;
                user.email = row.email;
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
            function (req, username, password,done) {
                var sql = "select * from users where username='" + username + "'";
                db.get(sql, function (err, row) {
                    if (err) {
                        return done(err);
                    }
                    if (row) { //then there is a user here already
                        return done(null, false, req.flash('registerMessage', 'Пользователь с данным логином существует'));
                    } else { //no entry, create user
                        // if there is no user with that email
                        // create the user
                        var user = {};
                        user.username = username;
                        if (req.body.password == req.body.password2) {
                            bcrypt.hash(password, 10, function (err, hash) { //hash the password and save to the sqlite database
                                if (err) {
                                    throw err;
                                }

                                user.password = hash;
                                var insertsql = "insert into users (username, password,lastname,firstname,patronymic,type_user,email) values('" + user.username + "', '" + user.password + "', '" + req.body.lastname + "',  '" + req.body.firstname + "', '" + req.body.patronymic + "', '" + req.body.type_user + "','" + req.body.email + "');";

                                db.run(insertsql, function (err) {
                                    if (err) {
                                        throw err;
                                    }

                                    return done(null, user);

                                }); //end run

                            });//end hash
                        }
                        else{
                            return done(null, false, req.flash('registerMessage', 'Пароли не совпадают'));
                        }
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
                        return done(null, false, req.flash('loginMessage', 'Пользователя с таким логином не существует'));
                    } //end !row
                    var user = {};
                    user.username = row.username;
                    user.lastname = row.lastname;
                    user.firstname = row.firstname;
                    user.created = row.created;
                    bcrypt.compare(password, row.password, function (err, res) {
                        if (res) {
                            return done(null, user);
                        } else {
                            return done(null, false, req.flash('loginMessage', 'Неверно введенный пароль.'));
                        }
                    }); //end compare
                });//end db.get
            })); //end local-login

        app.use(passport.initialize());
        app.use(passport.session());
    }; //end init
})(module.exports);