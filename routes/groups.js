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

router.get('/listGroup',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    result = [];
    db.all('SELECT * FROM studyGroups ORDER BY name', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result.push({id: row.id, name: row.name})
        });
        console.log(result);
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
        res.render('groups/listGroup', { title: 'Список групп', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.get('/addGroup',isLoggedIn, function(req, res, next) {
    res.render('groups/addGroup', { title: 'Добавить группу' })
});

router.post('/addGroup',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`INSERT INTO studyGroups(name,course) VALUES ('${req.body.name}', SUBSTR('${req.body.name}',2,1));`,
        (err) => {
            if (err) { console.error(err.message); }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                console.log('Last inserted id is: ' + row['id']);
            });
            res.redirect('/listGroup');
        }
    );
});


router.get('/studyGroups/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM studyGroups WHERE id=?', req.params.id, (err, rows) => {
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
        res.render('groups/studyGroups', { title: 'Описание групп', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.post('/studyGroups/:id',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`UPDATE studyGroup SET name='${req.body.name}' WHERE id=?;`, req.params.id);
    res.redirect('/listGroup');
});

router.get('/delGroup/:id', isLoggedIn,function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM studyGroups WHERE id=?', req.params.id, (err, rows) => {
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
        res.render('groups/delGroup', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.post('/delGroup/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`DELETE FROM studyGroups WHERE id=?;`, req.params.id);
    db.run(`UPDATE studyGroups SET id=id-1 WHERE id>?`,req.params.id);
    res.redirect('/listGroup').refresh();
});

module.exports = router;