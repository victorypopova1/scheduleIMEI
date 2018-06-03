var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var passport = require('passport');
var app = express();
var path = require('path');
var bcrypt = require('bcrypt');
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
        res.redirect('/schedule');
    }
};

/* GET home page. */


router.get('/', isLoggedIn, function(req, res, next) {
    var username,firstname,lastname,type_user,email,patronymic = '';
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

router.post('/fillSchedule', function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    //req.body.group  - AJAX data from /table
    var result =
        [[{},{},{},{},{},{},{}],
            [{},{},{},{},{},{},{}],
            [{},{},{},{},{},{},{}],
            [{},{},{},{},{},{},{}],
            [{},{},{},{},{},{},{}],
            [{},{},{},{},{},{},{}],
            [{},{},{},{},{},{},{}]];

    let str=`SELECT main_schedule.id, group_id, studyGroups.name as groupName ,weekday_id, time_id, time.id as timeId, time.time as timeName,
    classroom_id, class.name as className, teacher_id, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day  
    FROM main_schedule 
    INNER JOIN studyGroups ON studyGroups.id=main_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=main_schedule.weekday_id 
    INNER JOIN time ON time.id=main_schedule.time_id  
    INNER JOIN class ON class.id=main_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=main_schedule.teacher_id  
    INNER JOIN subject ON subject.id=main_schedule.subject_id 
    WHERE group_id IN (SELECT id FROM studyGroups WHERE name=?) `;

    db.all(str, req.body.group, (err, rows) => {
        if (err) {
        }else {
            rows.forEach((row) => {
                //console.log(row);
                //console.log("-------");
                //console.log(row.time_id+" "+row.weekday_id);
                //console.log("-------");
                result[row.time_id][row.weekday_id] = {
                    id: row.id,
                    timeId: row.timeId,
                    day: row.day,
                    weekdayId:row.dayId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname+" "+row.firstname+" "+row.patronymic,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName
                };
                //console.log(result[row.time_id][row.weekday_id] );
            });
        };
        //console.log(result);
        //console.log("---------------");
        res.send(JSON.stringify(result));
    });
});
/**
 * Записывает информацию о расписании занятий при ручном редактировании в базу данных.
 * Одна запись содержит: день недели, время проведения занятия, название предмета, ФИО преподавателя, номер аудитории
 * @public
 * @function
 * @name saveChanges
 * @param {Object} req - Информация о введённых данных в форму
 * @param {Object} res - Перенаправление на нужную страницу в случае, если запись успешно добавлена
 *
 */
router.post('/saveChanges', function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    let result={};
    db.all(`SELECT id FROM studyGroups WHERE name ='${req.body.clickedGroupName}'`, (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result["groupId"]=row.id;
        });

        db.all(`SELECT id FROM time WHERE time ='${req.body.clickedDateTime}'`, (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                result["timeId"] = row.id;
            });

            db.all(`SELECT id FROM weekdays WHERE day='${req.body.clickedDateDay}'`, (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    result["dayId"] = row.id;
                });
                db.all(`SELECT id FROM subject WHERE name='${req.body.subjectSelect}'`, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    rows.forEach((row) => {
                        result["subjectId"] = row.id;
                    });
                    var teacherName = req.body.teacherSelect.split(' ');
                    db.all(`SELECT id FROM teacher WHERE lastname='${teacherName[0]}' AND firstname='${teacherName[1]}' AND patronymic='${teacherName[2]}'`, (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        rows.forEach((row) => {
                            result["teacherId"] = row.id;
                        });
                        db.all(`SELECT id FROM class WHERE name='${req.body.classroomSelect}'`, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            rows.forEach((row) => {
                                result["classId"] = row.id;
                            });
                            db.all("SELECT * FROM main_schedule WHERE group_id=? AND time_id=? AND weekday_id=?", result["groupId"],result["timeId"],result["dayId"], (err, rows) => {
                                if (err) {
                                    throw err;
                                }
                                if(rows.length==0){
                                    db.all(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id)
                                VALUES (?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], (err, rows) => {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                }else{
                                    db.all(`UPDATE main_schedule SET subject_id=?,teacher_id=?,classroom_id=? 
                               WHERE group_id=? AND time_id=? AND weekday_id=?`, result["subjectId"], result["teacherId"], result["classId"], result["groupId"], result["timeId"], result["dayId"], (err, rows) => {
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
        res.sendStatus(200);
    });
});

router.get('/table', isLoggedIn, function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    var subjects = [];
    db.all('SELECT * FROM subject ORDER BY name', (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            subjects.push({name: row.name, id: row.id});
        });
        db.close();
        var teacher = [];
        db.all('SELECT * FROM teacher ORDER BY lastname', (err, rows) => {
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
            db.all('SELECT * FROM studyGroups ORDER BY name', (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    studyGroups.push({name: row.name, id: row.id});
                });
                var classrooms = [];
                db.all('SELECT * FROM class ORDER BY name', (err, rows) => {
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
                            var username,firstname,lastname,type_user,email,patronymic,userGroups = '';
                            if (req.user){
                                username = req.user.username;
                                lastname=req.user.lastname;
                                firstname=req.user.firstname;
                                type_user=req.user.type_user;
                                email=req.user.email;
                                patronymic=req.user.patronymic;
                                userGroups=req.user.studyGroups;

                            }
                            res.render('table', {
                                title: 'Режим редактирования',
                                subjects: subjects,
                                teachers: teacher,
                                classrooms: classrooms,
                                studyGroups: studyGroups,
                                times: times,
                                weekdays: weekdays,
                                username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email,userGroups:userGroups
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/tableSubjects', function (req, res, next) {
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
        res.render('selectGroup', {list: result});
    });
});

router.get('/schedule/:id', function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    result = [];
    db.all('SELECT * FROM studyGroups WHERE id=?', req.params.id, (err, rows1) => {
        if (err) {
            throw err;
        }
        rows1.forEach((row) => {
            result.push({id: row.id, name:row.name,course:row.course})
        });
        var studyGroups = [];
        db.all('SELECT * FROM studyGroups ORDER BY name', (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                studyGroups.push({name: row.name, id: row.id});
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
                    res.render('schedule', {
                        studyGroups: studyGroups,
                        times: times,
                        weekdays: weekdays,
                        val: rows1[0]
                    });
                });
            });

        });
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
            result.push({id: row.id, lastname: row.lastname, firstname: row.firstname, patronymic: row.patronymic, email: row.email, type_user: row.type_user, studyGroups: row.studyGroups})
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