var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var passport = require('passport');


/*auth part*/
isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
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
    res.render('register', {title: "Register", message: req.flash('registerMessage')});
});

router.post('/register', passport.authenticate('local-signup', {
    successRedirect : '/', //member page
    failureRedirect : '/login', //failed login
    failureFlash : true //flash msg
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    console.log(req.user);
    var username = '';
    if (req.user) username = req.user.username;
  res.render('index', { title: 'Расписание ИМЭИ ИГУ', username: username });
});

/*router.get('/', isLoggedIn, function(req, res, next) {
    console.log(req.user);
    var username = '';
    if (req.user) username = req.user.username; 
  res.render('layout', { title: 'Расписание ИМЭИ ИГУ', username: username });
});*/

router.get('/addTeacher', function(req, res, next) {
    var username = '';
    if (req.user) username = req.user.username;
  res.render('addTeacher', { title: 'Добавить преподавателя', username: username })
});

router.post('/addTeacher', function(req, res, next) {
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

router.post('/teacher/:id', function(req, res, next) {
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
        if (req.user) username = req.user.username;
        res.render('teacher', { title: 'Описание ', val: rows[0],username: username});
});
});

router.post('/delTeacher/:id', function(req, res, next) {
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
        if (req.user) username = req.user.username;
        res.render('delTeacher', { title: 'Описание ', val: rows[0],username:username });
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
  db.all('SELECT * FROM teacher', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id,  lastname: row.lastname, firstname: row.firstname, patronymic: row.patronymic })
    });
    var username = '';
    if (req.user) username = req.user.username;
    res.render('listTeacher', { title: 'Список преподавателей', list: result,username: username  });
  });
});
router.post('/delTeacher/:id', function(req, res, next) {
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
        if (req.user) username = req.user.username;
        res.render('delTeacher', { title: 'Описание ', val: rows[0],username:username });
});
});
 router.get('/addSubject', function(req, res, next) {
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

router.post('/subject/:id', function(req, res, next) {
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
  db.all('SELECT * FROM subject', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id, name: row.name})
    });
    console.log(result);
    var username = '';
    if (req.user) username = req.user.username;
    res.render('listSubject', { title: 'Список предметов', list: result,username:username });
  });
});

router.get('/subject/:id', isLoggedIn,function(req, res, next) {
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
      if (req.user) username = req.user.username;
    res.render('subject', { title: 'Описание предмета', val: rows[0],username:username });
  });
});

router.get('/table',function (req, res, next) {
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
            subjects.push({ name: row.name });
        });
        db.close();
    var teacher = [];
        db.all('SELECT * FROM teacher', (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                teacher.push({ lastname: row.lastname, firstname:row.firstname, patronymic:row.patronymic });
            });
        console.log(subjects);
        console.log(teacher);
        res.render('table', { title: 'Режим редактирования', subjects: subjects, teachers: teacher });
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

router.get('/addClass', function(req, res, next) {
  res.render('addClass', { title: 'Добавить аудиторию' })
});

router.post('/addClass', function(req, res, next) {
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

router.post('/class/:id', function(req, res, next) {
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
  db.all('SELECT * FROM class', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id, name: row.name})
    });
    console.log(result);
      var username = '';
      if (req.user) username = req.user.username;
    res.render('listClass', { title: 'Список аудиторий', list: result,username:username });
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
      if (req.user) username = req.user.username;
    res.render('class', { title: 'Описание аудитории', val: rows[0],username:username });
  });
});



router.get('/addGroup', function(req, res, next) {
  res.render('addGroup', { title: 'Добавить группу' })
});

router.post('/addGroup', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
      db.run(`INSERT INTO group1(name) VALUES ('${req.body.name}');`,
    (err) => {
      if (err) { console.error(err.message); }
     db.get("SELECT last_insert_rowid() as id", function (err, row) {
       console.log('Last inserted id is: ' + row['id']);
     });
      res.redirect('/listGroup');
    }
  ); 
});

router.post('/group1/:id', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
      //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
     db.run(`UPDATE group1 SET name='${req.body.name}' WHERE id=?;`, req.params.id);
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
  db.all('SELECT * FROM group1', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id, name: row.name})
    });
    console.log(result);
      var username = '';
      if (req.user) username = req.user.username;
    res.render('listGroup', { title: 'Список групп', list: result,username:username });
  });
});

router.get('/group1/:id',isLoggedIn, function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  db.all('SELECT * FROM group1 WHERE id=?', req.params.id, (err, rows) => {
    if (err) {
      throw err;
    }
      var username = '';
      if (req.user) username = req.user.username;
    res.render('group1', { title: 'Описание групп', val: rows[0],username:username });
  });
});

router.get('/addDays', function(req, res, next) {
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
  db.all('SELECT * FROM days', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id,  name: row.name})
    });
      var username = '';
      if (req.user) username = req.user.username;
    res.render('listDays', { title: 'Список дней', list: result,username:username });
  });
});
router.post('/addDays', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  db.run(`INSERT INTO days(name) VALUES ('${req.body.name}');`,
    (err) => {
      if (err) { console.error(err.message); }
     db.get("SELECT last_insert_rowid() as id", function (err, row) {
       console.log('Last inserted id is: ' + row['id']);
     });
      res.redirect('/listDays');
    }
  );       
});

router.post('/days/:id', function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    //db.run(`UPDATE days SET name='Data' WHERE id=?;`,
    db.run(`UPDATE days SET name='${req.body.name}' WHERE id=?;`, req.params.id);
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
  db.all('SELECT * FROM days WHERE id=?', req.params.id, (err, rows) => {
    if (err) {
      throw err;
    }
      var username = '';
      if (req.user) username = req.user.username;
    res.render('days', { title: 'Описание дня', val: rows[0],username:username });
  });
});
router.post('/delSubject/:id', function(req, res, next) {
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
      if (req.user) username = req.user.username;
      res.render('delSubject', { title: 'Описание ', val: rows[0],username:username });
});
});



router.post('/delGroup/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  //db.run(`UPDATE group1 SET name='Data' WHERE id=?;`,
  db.run(`DELETE FROM group1 WHERE id=?;`, req.params.id);
  db.run(`UPDATE group1 SET id=id-1 WHERE id>?`,req.params.id);
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
  db.all('SELECT * FROM group1 WHERE id=?', req.params.id, (err, rows) => {
      if (err) {
          throw err;
      }
      var username = '';
      if (req.user) username = req.user.username;
      res.render('delGroup', { title: 'Описание ', val: rows[0],username:username });
});
});


router.post('/delClass/:id', function(req, res, next) {
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
      if (req.user) username = req.user.username;
      res.render('delClass', { title: 'Описание ', val: rows[0],username:username });
});
});



router.post('/delDays/:id', function(req, res, next) {
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
      var username = '';
      if (req.user) username = req.user.username;
      res.render('delDays', { title: 'Описание ', val: rows[0],username:username });
});
});

module.exports = router;