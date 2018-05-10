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
    res.render('login', { title: "Login", message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

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

            res.render('register', {title: "Регистрация",username: username , lastname: lastname, firstname: firstname, patronymic: patronymic, type_user: type_user,email:email, list: result,studyGroups:studyGroups, message: req.flash('registerMessage')});
        });
        });
    }

    else{
        res.render('register', {title: "Регистрация", message: req.flash('registerMessage')
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
    res.render('successfully', {title: "Регистрация",username: username , lastname: lastname, firstname: firstname, patronymic: patronymic, type_user: type_user,email:email });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/changePassword',isLoggedIn,function(req, res, next) {
    var password = '';
    if (req.user) username = req.user.username;
    res.render('changePassword', { title: 'Изменить пароль', username: username, message: req.flash('changePassword') });
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
        res.render('changePassword', {n:1, title: 'Изменить пароль', username: username, message: 'Пароли не совпадают'});
    }
});

router.get('/personalAccount', isLoggedIn, function(req, res, next) {
    var username,lastname,firstname,patronymic,type_user,email = '';
    if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }
    res.render('personalAccount', { title: 'Личный кабинет', username: username , lastname: lastname, firstname: firstname, patronymic: patronymic, type_user: type_user,email:email });
});

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    var username = '';
    var lastname,type_user,email,patronymic = '';
    var firstname = '';
    if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }

    res.render('index',{ title: 'Расписание ИМЭИ ИГУ', username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email });
});

/*router.get('/', isLoggedIn, function(req, res, next) {
    console.log(req.user);
    var username = '';
    if (req.user) username = req.user.username; 
  res.render('layout', { title: 'Расписание ИМЭИ ИГУ', username: username });
});*/

router.get('/addTeacher',isLoggedIn, function(req, res, next) {
    var username = '';
    if (req.user) username = req.user.username;
    res.render('addTeacher', { title: 'Добавить преподавателя', username: username })
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
    db.run(`INSERT INTO teacher(lastname, firstname, patronymic) VALUES ('${req.body.lastname}', '${req.body.firstname}', '${req.body.patronymic}');`,
        (err) => {
            if (err) { console.error(err.message); }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                console.log('Last inserted id is: ' + row['id']);
            });
            res.redirect('/listTeacher');
        }
    );
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
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`UPDATE teacher SET lastname='${req.body.lastname}', firstname='${req.body.firstname}', patronymic='${req.body.patronymic}' WHERE id=?;`, req.params.id);
    res.redirect('/listTeacher');
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
        var username = '';
        var lastname,type_user,email,patronymic = '';
        var firstname = '';
        if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }
        res.render('teacher', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
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
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`DELETE FROM teacher WHERE id=?;`, req.params.id,()=> {
        res.redirect('/listTeacher');
    });

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
        res.render('delTeacher', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

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
            result.push({id: row.id,  lastname: row.lastname, firstname: row.firstname, patronymic: row.patronymic })
        });
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
        res.render('listTeacher', { title: 'Список преподавателей', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
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
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`DELETE FROM teacher WHERE id=?;`, req.params.id);
    db.run(`UPDATE teacher SET id=id-1 WHERE id>?`,req.params.id);
    res.redirect('/listTeacher').refresh();
});

router.get('/delTeacher/:id', isLoggedIn,function(req, res, next) {
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
        res.render('delTeacher', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});
router.get('/addSubject',isLoggedIn, function(req, res, next) {
    res.render('addSubject', { title: 'Добавить предмет' })
});

router.post('/addSubject', function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`INSERT INTO subject(name) VALUES ('${req.body.name}');`,
        (err) => {
            if (err) { console.error(err.message); }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                console.log('Last inserted id is: ' + row['id']);
            });
            res.redirect('/listSubject');
        }
    );
});

router.post('/subject/:id',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`UPDATE subject SET name='${req.body.name}' WHERE id=?;`, req.params.id);
    res.redirect('/listSubject');
});

router.get('/listSubject', isLoggedIn,function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    result = [];
    db.all('SELECT * FROM subject ORDER BY name', (err, rows) => {
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
        res.render('listSubject', { title: 'Список предметов', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.get('/subject/:id',isLoggedIn, isLoggedIn,function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM subject WHERE id=?', req.params.id, (err, rows) => {
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
        res.render('subject', { title: 'Описание предмета', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.get('/addClass',isLoggedIn, function(req, res, next) {
    res.render('addClass', { title: 'Добавить аудиторию' })
});

router.post('/addClass',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`INSERT INTO class(name) VALUES ('${req.body.name}');`,
        (err) => {
            if (err) { console.error(err.message); }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                console.log('Last inserted id is: ' + row['id']);
            });
            res.redirect('/listClass');
        }
    );
});

router.post('/class/:id',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`UPDATE class SET name='${req.body.name}' WHERE id=?;`, req.params.id);
    res.redirect('/listClass');
});

router.get('/listClass',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    result = [];
    db.all('SELECT * FROM class ORDER BY name', (err, rows) => {
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
        res.render('listClass', { title: 'Список аудиторий', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.get('/class/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM class WHERE id=?', req.params.id, (err, rows) => {
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
        res.render('class', { title: 'Описание аудитории', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});



router.get('/addGroup',isLoggedIn, function(req, res, next) {
    res.render('addGroup', { title: 'Добавить группу' })
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
    db.run(`INSERT INTO studyGroups(name) VALUES ('${req.body.name}');`,
        (err) => {
            if (err) { console.error(err.message); }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                console.log('Last inserted id is: ' + row['id']);
            });
            res.redirect('/listGroup');
        }
    );
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
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`UPDATE studyGroup SET name='${req.body.name}' WHERE id=?;`, req.params.id);
    res.redirect('/listGroup');
});

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
        res.render('listGroup', { title: 'Список групп', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
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
        res.render('studyGroups', { title: 'Описание групп', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.get('/addDays',isLoggedIn, function(req, res, next) {
    res.render('addDays', { title: 'Добавить день недели' })
});
router.get('/listDays',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    result = [];
    db.all('SELECT * FROM weekdays', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result.push({id: row.id,  day: row.day})
        });
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
        res.render('listDays', { title: 'Список дней', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});
router.post('/addDays',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.run(`INSERT INTO weekdays(day) VALUES ('${req.body.name}');`,
        (err) => {
            if (err) { console.error(err.message); }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                console.log('Last inserted id is: ' + row['id']);
            });
            res.redirect('/listDays');
        }
    );
});

router.post('/days/:id',isLoggedIn, function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    //db.run(`UPDATE days SET name='Data' WHERE id=?;`,
    db.run(`UPDATE weekdays SET day='${req.body.day}' WHERE id=?;`, req.params.id);
    res.redirect('/listDays');
});

router.get('/days/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM weekdays WHERE id=?', req.params.id, (err, rows) => {
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
        res.render('days', { title: 'Описание дня', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});
router.post('/delSubject/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`DELETE FROM subject WHERE id=?;`, req.params.id);
    db.run(`UPDATE subject SET id=id-1 WHERE id>?`,req.params.id);
    res.redirect('/listSubject').refresh();
});

router.get('/delSubject/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM subject WHERE id=?', req.params.id, (err, rows) => {
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
        res.render('delSubject', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
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
    //db.run(`UPDATE group1 SET name='Data' WHERE id=?;`,
    db.run(`DELETE FROM studyGroups WHERE id=?;`, req.params.id);
    db.run(`UPDATE studyGroups SET id=id-1 WHERE id>?`,req.params.id);
    res.redirect('/listGroup').refresh();
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
        res.render('delGroup', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});


router.post('/delClass/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    //db.run(`UPDATE class SET name='Data' WHERE id=?;`,
    db.run(`DELETE FROM class WHERE id=?;`, req.params.id);
    db.run(`UPDATE class SET id=id-1 WHERE id>?`,req.params.id);
    res.redirect('/listClass').refresh();
});

router.get('/delClass/:id', isLoggedIn,function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM class WHERE id=?', req.params.id, (err, rows) => {
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
        res.render('delClass', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});



router.post('/delDays/:id',isLoggedIn, function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    //db.run(`UPDATE days SET name='Data' WHERE id=?;`,
    db.run(`DELETE FROM days WHERE id=?;`, req.params.id);
    db.run(`UPDATE days SET id=id-1 WHERE id>?`,req.params.id);
    res.redirect('/listDays').refresh();
});

router.get('/delDays/:id', isLoggedIn,function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    db.all('SELECT * FROM days WHERE id=?', req.params.id, (err, rows) => {
        if (err) {
            throw err;
        }
        var username ,lastname,type_user,email,patronymic,firstname = '';
        if (req.user){
        username = req.user.username;
        lastname=req.user.lastname;
        firstname=req.user.firstname;
        type_user=req.user.type_user;
        email=req.user.email;
        patronymic=req.user.patronymic;
    }
        res.render('delDays', { title: 'Описание ', val: rows[0],username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});

router.get('/studyGroups/:id', function (req, res, next) {
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
        res.render('studyGroups', {title: 'Описание групп', val: rows[0]});
    });
});

router.post('/saveChanges', function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    var arr = [];
    db.all(`SELECT id FROM studyGroups WHERE name ='${req.body.clickedGroupName}'`, (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            arr.push({id: row.id, studyGroup: req.body.clickedGroupName});
        });

        db.all(`SELECT id FROM time WHERE time ='${req.body.clickedDateTime}'`, (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                arr.push({id: row.id, time: req.body.clickedDateTime});
            });

            db.all(`SELECT * FROM weekdays WHERE day='${req.body.clickedDateDay}'`, (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    arr.push({id: row.id, day: row.day});
                });
                db.all(`SELECT * FROM subject WHERE name='${req.body.subjectSelect}'`, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    rows.forEach((row) => {
                        arr.push({id: row.id, subject: req.body.subjectSelect});
                    });
                    var teacherName = req.body.teacherSelect.split(' ');
                    db.all(`SELECT * FROM teacher WHERE lastname='${teacherName[0]}' AND firstname='${teacherName[1]}' AND patronymic='${teacherName[2]}'`, (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        rows.forEach((row) => {
                            arr.push({
                                id: row.id,
                                lastname: teacherName[0],
                                firstname: teacherName[1],
                                patronymic: teacherName[2]
                            });
                        });
                        db.all(`SELECT * FROM class WHERE name='${req.body.classroomSelect}'`, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            rows.forEach((row) => {
                                arr.push({id: row.id, classroom: req.body.classroomSelect});
                            });
                            db.all(`SELECT * FROM main_schedule WHERE group_id='${arr[0].id}' AND time_id='${arr[1].id}' AND weekday_id='${arr[2].id}'`, (err, rows) => {
                                if (err) {
                                    throw err;
                                }
                                if (rows.length == 0) {
                                    var str = "'" + arr[0].id + "','" + arr[1].id + "','" + arr[2].id + "','" + arr[3].id + "','" + arr[4].id + "','" + arr[5].id;
                                    console.log(str);
                                    db.all(`INSERT INTO main_schedule(group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id) VALUES (` + str + `')`, (err, rows) => {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
    res.redirect('/table');

});

router.post('/fillSchedule', function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    var result = [];
    var subjectVal, groupVal, teacherVal, classroomVal, timeVal, weekdayVal, groupId="2";

    db.all(`SELECT * FROM studyGroups WHERE name=?`, req.body.group, (err, rows) => {
        var arr = {};
        if (err) {
            throw err;
        }
        groupId = rows[0].name;
    });
        db.all(`SELECT id FROM studyGroups WHERE name=?`, req.body.group, (err, rows) => {
            var arr={};
            if (err) {
                throw err;
            }
            groupId = rows[0].id;
            db.all(`SELECT * FROM main_schedule WHERE group_id =?`, groupId, (err, rows) => {
                groupVal = req.body.group;
                if (err) {
                    throw err;
                }
                arr["group"]=req.body.group;
                rows.forEach((row) => {
                    db.all(`SELECT name FROM subject WHERE id='${row.subject_id}'`, (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        subjectVal = rows[0].name;
                        arr["subject"]=subjectVal;
                        db.all(`SELECT lastname,firstname,patronymic FROM teacher WHERE id='${row.teacher_id}'`, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            teacherVal = rows[0].lastname + " " + rows[0].firstname + " " + rows[0].patronymic;
                            arr["teacher"]=teacherVal;
                        });
                        db.all(`SELECT name FROM class WHERE id='${row.classroom_id}'`, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            classroomVal = rows[0].name;
                            arr["classroom"]=classroomVal;
                        });
                        db.all(`SELECT time FROM time WHERE id='${row.time_id}'`, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            timeVal = rows[0].time;
                            arr["time"]=timeVal;
                        });
                        db.all(`SELECT day FROM weekdays WHERE id='${row.weekday_id}'`, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            weekdayVal = rows[0].day;
                            arr["weekday"]=weekdayVal;
                            result.push(arr);
                        });
                    });
                });
            });
        });
    });
router.get('/table', function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    var subjects = [];
    db.all('SELECT * FROM subject', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            subjects.push({name: row.name, id: row.id});
        });
        db.close();
        var teacher = [];
        db.all('SELECT * FROM teacher', (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                teacher.push({
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    id: row.id
                });
            });
            var studyGroups = [];
            db.all('SELECT * FROM studyGroups', (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    studyGroups.push({name: row.name, id: row.id});
                });
                var classrooms = [];
                db.all('SELECT * FROM class', (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    rows.forEach((row) => {
                        classrooms.push({id: row.id, name: row.name});
                    });
                    var times = [];
                    db.all('SELECT * FROM time', (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        rows.forEach((row) => {
                            times.push({id: row.id, time: row.time});

                        });
                        var weekdays = [];
                        db.all('SELECT * FROM weekdays', (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            rows.forEach((row) => {
                                weekdays.push({id: row.id, day: row.day});

                            });
                            var username ,lastname,type_user,email,patronymic,firstname = '';
                            if (req.user){
                                username = req.user.username;
                                lastname=req.user.lastname;
                                firstname=req.user.firstname;
                                type_user=req.user.type_user;
                                email=req.user.email;
                                patronymic=req.user.patronymic;
                            }
                            res.render('table', {
                                title: 'Режим редактирования',
                                subjects: subjects,
                                teachers: teacher,
                                classrooms: classrooms,
                                studyGroups: studyGroups,
                                times: times,
                                weekdays: weekdays,
                                username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email
                            });
                        });
                    });
                });
            });
        });

    });
});

router.get('/tableSubjects',function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    result = [];
    db.all('SELECT * FROM subject', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result.push(row.name)
        });
        res.json(result);
    });
});

router.get('/schedule', function(req, res, next) {
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
            result.push({id: row.id, name:row.name,course:row.course})
        });
        res.render('selectGroup', { title: 'Выберите группу', list: result});
    });
});
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
            result.push({id: row.id, lastname: row.lastname, firstname: row.firstname, patronymic: row.patronymic, email: row.email, type_user: row.type_user})
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
        res.render('listUser', { title: 'Список пользователей', list: result,username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email});
    });
});
module.exports = router;