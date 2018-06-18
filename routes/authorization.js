var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var passport = require('passport');
var app = express();
var path = require('path');
var bcrypt = require('bcrypt');
/*auth part*/
isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/schedule');
    }
};


router.get('/login', function (req, res) {
    res.render('authorization/login', { title: "Login", message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

/**
 * Позволяет регистрировать пользователя в системе. Записывает следующую информацию в базу данных:
 * логин, пароль, фамилия, имя, отчество, e-mail, тип пользователя. В случае, если тип пользователя - Староста, позволяет выбрать его группу.
 * @public
 * @function
 * @name register
 * @param {Object} req - Информация о введённых данных в форму
 * @param {Object} res - Перенаправление на нужную страницу в случае, если регистрация прошла успешно
 *
 */
router.get('/register', function (req, res) {
    if (req.user) {
        var db = new sqlite3.Database('./db/sample.db',
            sqlite3.OPEN_READWRITE,
            (err) => {
                if (err) {
                    console.error(err.message);
                }
            });
        result = [];
        db.all('SELECT * FROM type_user', (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                result.push({id: row.id, name: row.name});
            });
            var studyGroups = [];
            db.all('SELECT * FROM studyGroups ORDER BY name', (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    studyGroups.push({id: row.id, name: row.name});
                });

                var username,lastname,firstname,patronymic,type_user,email = '';

                username = req.user.username;
                lastname=req.user.lastname;
                firstname=req.user.firstname;
                type_user=req.user.type_user;
                email=req.user.email;
                patronymic=req.user.patronymic;

                res.render('authorization/register', {title: "Регистрация",username: username , lastname: lastname, firstname: firstname, patronymic: patronymic, type_user: type_user,email:email, list: result,studyGroups:studyGroups, message: req.flash('registerMessage')});
            });
        });
    }

    else{
        res.render('authorization/register', {title: "Регистрация", message: req.flash('registerMessage')
        });
    }
});

router.post('/register', passport.authenticate('local-signup', {
    successRedirect : '/successfully', //member page
    failureRedirect : '/register', //failed login
    failureFlash : true //flash msg

}));

router.get('/successfully',isLoggedIn, function (req, res) {
    var username,lastname,firstname,patronymic,type_user,email = '';
    if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }
    res.render('authorization/successfully', {title: "Регистрация",username: username , lastname: lastname, firstname: firstname, patronymic: patronymic, type_user: type_user,email:email });
});

/**
 * Предоставляет пользователю (только авторизованному) возможность выхода из системы.
 * @public
 * @function
 * @name logout
 * @param {Object} req - Данные о текущем пользователе
 * @param {Object} res - Перенаправление на нужную страницу
 *
 */

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/changePassword',isLoggedIn,function(req, res, next) {
    var password = '';
    if (req.user) username = req.user.username;
    res.render('authorization/changePassword', { title: 'Изменить пароль', username: username, message: req.flash('changePassword') });
});


/*router.post('/changePassword', passport.authenticate('local-changePassword', {
    successRedirect : '/', //member page
    failureRedirect : '/changePassword', //failed login
    failureFlash : true //flash msg
}));*/

router.post('/changePassword',isLoggedIn, function(req, res, next) {
    console.log(req.user.id);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    if(req.body.newpassword1==req.body.newpassword2) {
        bcrypt.hash(req.body.newpassword1, 10, function (err, hash) { //hash the password and save to the sqlite database
            if (err) {
                throw err;
            }
            req.body.newpassword1 = hash;
            db.run(`UPDATE users SET password='${req.body.newpassword1}' WHERE id=?;`, req.user.id);
            res.redirect('/');
        });
    }
    if(req.body.newpassword1!=req.body.newpassword2) {
        res.render('authorization/changePassword', {n:1, title: 'Изменить пароль', username: username, message: 'Пароли не совпадают'});
    }
});

/**
 * Предоставляет пользователю доступ к функциональности личного кабинета. Для каждого типа пользователя доступны свои различные методы.
 * @public
 * @function
 * @name personalAccount
 * @param {Object} req - Данные о текущем пользователе
 * @param {Object} res - Перенаправление на нужную страницу в случае, если пользователь авторизован в системе
 *
 */
router.get('/personalAccount', isLoggedIn, function(req, res) {
    var username,lastname,firstname,patronymic,type_user,email,userGroups = '';
    if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
        userGroups=req.user.studyGroups;
    }
    res.render('authorization/personalAccount', { title: 'Личный кабинет', username: username , lastname: lastname, firstname: firstname, patronymic: patronymic, type_user: type_user,email:email,userGroups:userGroups });
});

module.exports = router;