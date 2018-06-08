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

router.get('/listTeacher',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    result = [];
    db.all('SELECT * FROM teacher ORDER BY lastname', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result.push({id: row.id,  lastname: row.lastname, firstname: row.firstname, patronymic: row.patronymic, rank: row.rank })
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
        res.render('teachers/listTeacher', { title: 'Список преподавателей', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.get('/addTeacher',isLoggedIn, function(req, res, next) {
    var username = '';
    if (req.user) username = req.user.username;
    res.render('teachers/addTeacher', { title: 'Добавить преподавателя', username: username })
});

router.post('/addTeacher',isLoggedIn, function(req, res, next) {
    console.log(req.body.lastname + req.body.firstname + req.body.patronymic);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`INSERT INTO teacher(lastname, firstname, patronymic,rank) VALUES ('${req.body.lastname}', '${req.body.firstname}', '${req.body.patronymic}', '${req.body.rank}');`,
        (err) => {
            if (err) { console.error(err.message); }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                console.log('Last inserted id is: ' + row['id']);
            });
            res.redirect('/listTeacher');
        }
    );
});

router.get('/teacher/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM teacher WHERE id=?', req.params.id, (err, rows) => {
        if (err) {
            throw err;
        }
        var username,firstname,lastname,type_user,email,patronymic = '';
        if (req.user){
            username = req.user.username;
            lastname=req.user.lastname;
            firstname=req.user.firstname;
            type_user=req.user.type_user;
            email=req.user.email;
            patronymic=req.user.patronymic;
        }
        res.render('teachers/teacher', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, firstname: firstname, patronymic: patronymic, type_user: type_user,email:email});
    });
});
router.post('/teacher/:id',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`UPDATE teacher SET lastname='${req.body.lastname}', firstname='${req.body.firstname}', patronymic='${req.body.patronymic}',rank='${req.body.rank}' WHERE id=?;`, req.params.id);
    res.redirect('/listTeacher');
});


router.get('/delTeacher/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM teacher WHERE id=?', req.params.id, (err, rows) => {
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
        res.render('teachers/delTeacher', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});


router.post('/delTeacher/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`DELETE FROM teacher WHERE id=?;`, req.params.id);
    db.run(`UPDATE teacher SET id=id-1 WHERE id>?`,req.params.id);
    res.redirect('/listTeacher').refresh();
});


module.exports = router;