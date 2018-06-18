var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var passport = require('passport');
var app = express();
var path = require('path');
var bcrypt = require('bcrypt');
var fs = require("fs");
var multiparty = require("multiparty");
var XLSX = require("XLSX");
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
/*auth part*/


/**
 * Проверяет авторизован пользователь в системе или нет. Используется для предоставления доступа к отпределенным маршрутам.
 * @public
 * @function
 * @name isLoggedIn
 * @param {Object} req - Получение данных об авторизации пользователя
 * @param {Object} res - Перенаправление на страницу, если пользователь не авторизован в системе
 * @param {Object} next - Маршрут к странице на которую необходимо перейти
 *
 */

isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/selectGroup');
    }
};

/* GET home page. */
router.get('/listUser',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    result = [];
    db.all('SELECT * FROM users ORDER BY lastname', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result.push({id: row.id, lastname: row.lastname, firstname: row.firstname, patronymic: row.patronymic, email: row.email, type_user: row.type_user, studyGroups: row.studyGroups})
        });
        //console.log(result);
        var username = '';
        var lastname,type_user,email,patronymic,firstname = '';
        if (req.user){
            username = req.user.username;
            lastname=req.user.lastname;
            firstname=req.user.firstname;
            type_user=req.user.type_user;
            email=req.user.email;
            patronymic=req.user.patronymic;
        }
        res.render('listUser', { title: 'Список пользователей', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.get('/groupUpdate/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM users WHERE id=? ', req.params.id, (err, rows) => {
        if (err) {
            throw err;
        }
        var username = '';
        var lastname,type_user,email,patronymic,firstname = '';
        if (req.user){
            username = req.user.username;
            lastname=req.user.lastname;
            firstname=req.user.firstname;
            type_user=req.user.type_user;
            email=req.user.email;
            patronymic=req.user.patronymic;
        }
        res.render('groupUpdate', { title: 'Изменить группу', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.post('/groupUpdate/:id',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`UPDATE users SET studyGroups='${req.body.newGroup}' WHERE id=?;`, req.params.id);
    res.redirect('/listUser');
});


router.post('/groupUpdateAll',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    var result=[];
    db.all(`SELECT * FROM users WHERE type_user='Староста';`, (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result.push({id: row.id, studyGroups: row.studyGroups})
        });
        for (var i in result) {
            var c=result[i].studyGroups;
            var d =c.substr(2,1);
            console.log("numgr11 ",result);
            console.log("numgr ",d);
            if (d=="4")
            {
                db.run(`DELETE FROM users WHERE id=?;`, result[i].id);
            }
            else {
                var group2=result[i].studyGroups;
                var group3;
                if (d=="1") group3= group2.substr(0, 2) + "2"+ group2.substr(3);
                if (d=="2") group3= group2.substr(0, 2) + "3"+ group2.substr(3);
                if (d=="3") group3= group2.substr(0, 2) + "4"+ group2.substr(3);
                console.log("numgr22 ",group3);
                db.run(`UPDATE users SET studyGroups=? WHERE id=?;`, group3,result[i].id);
            }
        }
        res.redirect('/listUser');
    });
});

router.get('/changeFirstname',isLoggedIn, function(req, res, next) {
    var username = '';
    var lastname,type_user,email,patronymic,firstname = '';
    if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }
    res.render('change/changeFirstname', { title: 'Изменить имя', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
});


router.post('/changeFirstname',isLoggedIn, function(req, res, next) {
    console.log(req.user.id);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`UPDATE users SET firstname='${req.body.newfirstname}' WHERE id=?;`, req.user.id);
    res.redirect('/personalAccount');
});

router.get('/changeLastname',isLoggedIn, function(req, res, next) {
    var username = '';
    var lastname,type_user,email,patronymic,firstname = '';
    if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }
    res.render('change/changeLastname', { title: 'Изменить фамилию', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
});


router.post('/changeLastname',isLoggedIn, function(req, res, next) {
    console.log(req.user.id);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`UPDATE users SET lastname='${req.body.newlastname}' WHERE id=?;`, req.user.id);
    res.redirect('/personalAccount');
});

router.get('/changePatronymic',isLoggedIn, function(req, res, next) {
    var username = '';
    var lastname,type_user,email,patronymic,firstname = '';
    if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }
    res.render('change/changePatronymic', { title: 'Изменить отчество', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
});


router.post('/changePatronymic',isLoggedIn, function(req, res, next) {
    console.log(req.user.id);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`UPDATE users SET patronymic='${req.body.newpatronymic}' WHERE id=?;`, req.user.id);
    res.redirect('personalAccount');
});

router.get('/changeEmail',isLoggedIn, function(req, res, next) {
    var username = '';
    var lastname,type_user,email,patronymic,firstname = '';
    if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }
    res.render('change/changeEmail', { title: 'Изменить email', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
});


router.post('/changeEmail',isLoggedIn, function(req, res, next) {
    console.log(req.user.id);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`UPDATE users SET email='${req.body.newemail}' WHERE id=?;`, req.user.id);
    res.redirect('/personalAccount');
});
module.exports = router;