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

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
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
    teacher.firstname as firstname, teacher.rank as rank, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day,week, typeSubject.briefly as type_subject  
    FROM main_schedule 
    INNER JOIN studyGroups ON studyGroups.id=main_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=main_schedule.weekday_id 
    INNER JOIN time ON time.id=main_schedule.time_id  
    INNER JOIN class ON class.id=main_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=main_schedule.teacher_id  
    INNER JOIN subject ON subject.id=main_schedule.subject_id
	INNER JOIN typeSubject ON typeSubject.id=main_schedule.type_subject 
    WHERE group_id IN (SELECT id FROM studyGroups WHERE name=?) AND week=? AND additionalPair=?`;

    //console.log(req.body.week);
    db.all(str, req.body.group,req.body.week,1, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            rows.forEach((row) => {
                //console.log(row);
                //console.log("-------");
                //console.log(row.time_id+" "+row.weekday_id);
                //console.log("-------");
                result[row.time_id][row.weekday_id] = {
                    id: row.id,
                    timeId: row.timeId,
                    day: row.day,
                    weekdayId: row.dayId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname + " " + row.firstname + " " + row.patronymic+ ", " + row.rank,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    week: row.week,
                    type_subject:row.type_subject
                };

                //console.log(result[row.time_id][row.weekday_id]);
                //console.log(row.time_id,row.weekday_id);
            });
        };
        //console.log(result);
        //console.log("---------------");

        res.send(JSON.stringify(result));

    });
});

router.post('/fillScheduleSecondPair', function (req, res, next) {
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
    teacher.firstname as firstname, teacher.rank as rank, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day,week, typeSubject.briefly as type_subject  
    FROM main_schedule 
    INNER JOIN studyGroups ON studyGroups.id=main_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=main_schedule.weekday_id 
    INNER JOIN time ON time.id=main_schedule.time_id  
    INNER JOIN class ON class.id=main_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=main_schedule.teacher_id  
    INNER JOIN subject ON subject.id=main_schedule.subject_id
	INNER JOIN typeSubject ON typeSubject.id=main_schedule.type_subject 
    WHERE group_id IN (SELECT id FROM studyGroups WHERE name=?) AND week=? AND additionalPair=?`;

    //console.log(req.body.week);
    db.all(str, req.body.group,req.body.week,2, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            rows.forEach((row) => {
                //console.log(row);
                //console.log("-------");
                //console.log(row.time_id+" "+row.weekday_id);
                //console.log("-------");
                result[row.time_id][row.weekday_id] = {
                    id: row.id,
                    timeId: row.timeId,
                    day: row.day,
                    weekdayId: row.dayId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname + " " + row.firstname + " " + row.patronymic+ ", " + row.rank,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    week: row.week,
                    type_subject:row.type_subject
                };

                //console.log(result[row.time_id][row.weekday_id]);
                //console.log(row.time_id,row.weekday_id);
            });
        };
        //console.log(result);
        //console.log(result);
        //console.log("---------------");

        res.send(JSON.stringify(result));

    });
});

router.post('/fillScheduleThirdPair', function (req, res, next) {
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
    teacher.firstname as firstname, teacher.rank as rank, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day,week, typeSubject.briefly as type_subject  
    FROM main_schedule 
    INNER JOIN studyGroups ON studyGroups.id=main_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=main_schedule.weekday_id 
    INNER JOIN time ON time.id=main_schedule.time_id  
    INNER JOIN class ON class.id=main_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=main_schedule.teacher_id  
    INNER JOIN subject ON subject.id=main_schedule.subject_id
	INNER JOIN typeSubject ON typeSubject.id=main_schedule.type_subject 
    WHERE group_id IN (SELECT id FROM studyGroups WHERE name=?) AND week=? AND additionalPair=?`;

    //console.log(req.body.week);
    db.all(str, req.body.group,req.body.week,3, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            rows.forEach((row) => {
                //console.log(row);
                //console.log("-------");
                //console.log(row.time_id+" "+row.weekday_id);
                //console.log("-------");
                result[row.time_id][row.weekday_id] = {
                    id: row.id,
                    timeId: row.timeId,
                    day: row.day,
                    weekdayId: row.dayId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname + " " + row.firstname + " " + row.patronymic+ ", " + row.rank,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    week: row.week,
                    type_subject:row.type_subject
                };

                //console.log(result[row.time_id][row.weekday_id]);
                //console.log(row.time_id,row.weekday_id);
            });
        };
        //console.log(result);
        //console.log("---------------");

        res.send(JSON.stringify(result));

    });
});

router.post('/fillScheduleTemporary', function (req, res, next) {
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

    let str=`SELECT temporary_schedule.id, group_id, studyGroups.name as groupName ,weekday_id, time_id, time.id as timeId, time.time as timeName,
    classroom_id, class.name as className, teacher_id, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, teacher.rank as rank, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day,week, typeSubject.briefly as type_subject, begin_date, end_date  
    FROM temporary_schedule 
    INNER JOIN studyGroups ON studyGroups.id=temporary_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=temporary_schedule.weekday_id 
    INNER JOIN time ON time.id=temporary_schedule.time_id  
    INNER JOIN class ON class.id=temporary_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=temporary_schedule.teacher_id  
    INNER JOIN subject ON subject.id=temporary_schedule.subject_id
	INNER JOIN typeSubject ON typeSubject.id=temporary_schedule.type_subject 
    WHERE group_id IN (SELECT id FROM studyGroups WHERE name=?) AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?`;

    //console.log(req.body.week);
    db.all(str, req.body.group,req.body.week,0,req.body.selectDate,req.body.selectDate, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            rows.forEach((row) => {
                //console.log(row);
                //console.log("-------");
                //console.log(row.time_id+" "+row.weekday_id);
                //console.log("-------");
                result[row.time_id][row.weekday_id] = {
                    id: row.id,
                    timeId: row.timeId,
                    day: row.day,
                    weekdayId: row.dayId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname + " " + row.firstname + " " + row.patronymic+ ", " + row.rank,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    week: row.week,
                    type_subject:row.type_subject,
                    beginDate: row.begin_date,
                    endDate: row.end_date
                };

               // console.log(new Date(row.begin_date),new Date(row.end_date));
                //console.log(result[row.time_id][row.weekday_id]);
                //console.log(row.time_id,row.weekday_id);
            });
        };
        //console.log(result);
        //console.log("---------------");

        res.send(JSON.stringify(result));

    });
});

router.post('/fillScheduleTemporaryFirst', function (req, res, next) {
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

    let str=`SELECT temporary_schedule.id, group_id, studyGroups.name as groupName ,weekday_id, time_id, time.id as timeId, time.time as timeName,
    classroom_id, class.name as className, teacher_id, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, teacher.rank as rank, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day,week, typeSubject.briefly as type_subject, begin_date, end_date  
    FROM temporary_schedule 
    INNER JOIN studyGroups ON studyGroups.id=temporary_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=temporary_schedule.weekday_id 
    INNER JOIN time ON time.id=temporary_schedule.time_id  
    INNER JOIN class ON class.id=temporary_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=temporary_schedule.teacher_id  
    INNER JOIN subject ON subject.id=temporary_schedule.subject_id
	INNER JOIN typeSubject ON typeSubject.id=temporary_schedule.type_subject 
    WHERE group_id IN (SELECT id FROM studyGroups WHERE name=?) AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?`;

    db.all(str, req.body.group,req.body.week,1,req.body.selectDate,req.body.selectDate, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            rows.forEach((row) => {
                result[row.time_id][row.weekday_id] = {
                    id: row.id,
                    timeId: row.timeId,
                    day: row.day,
                    weekdayId: row.dayId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname + " " + row.firstname + " " + row.patronymic+ ", " + row.rank,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    week: row.week,
                    type_subject:row.type_subject,
                    beginDate: row.begin_date,
                    endDate: row.end_date
                };

                // console.log(new Date(row.begin_date),new Date(row.end_date));
                //console.log(result[row.time_id][row.weekday_id]);
                //console.log(row.time_id,row.weekday_id);
            });
        };
        //console.log(result);
        //console.log("---------------");

        res.send(JSON.stringify(result));

    });
});

router.post('/fillScheduleTemporarySecond', function (req, res, next) {
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

    let str=`SELECT temporary_schedule.id, group_id, studyGroups.name as groupName ,weekday_id, time_id, time.id as timeId, time.time as timeName,
    classroom_id, class.name as className, teacher_id, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, teacher.rank as rank, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day,week, typeSubject.briefly as type_subject, begin_date, end_date  
    FROM temporary_schedule 
    INNER JOIN studyGroups ON studyGroups.id=temporary_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=temporary_schedule.weekday_id 
    INNER JOIN time ON time.id=temporary_schedule.time_id  
    INNER JOIN class ON class.id=temporary_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=temporary_schedule.teacher_id  
    INNER JOIN subject ON subject.id=temporary_schedule.subject_id
	INNER JOIN typeSubject ON typeSubject.id=temporary_schedule.type_subject 
    WHERE group_id IN (SELECT id FROM studyGroups WHERE name=?) AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?`;

    db.all(str, req.body.group,req.body.week,2,req.body.selectDate,req.body.selectDate, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            rows.forEach((row) => {
                result[row.time_id][row.weekday_id] = {
                    id: row.id,
                    timeId: row.timeId,
                    day: row.day,
                    weekdayId: row.dayId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname + " " + row.firstname + " " + row.patronymic+ ", " + row.rank,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    week: row.week,
                    type_subject:row.type_subject,
                    beginDate: row.begin_date,
                    endDate: row.end_date
                };

                // console.log(new Date(row.begin_date),new Date(row.end_date));
                //console.log(result[row.time_id][row.weekday_id]);
                //console.log(row.time_id,row.weekday_id);
            });
        };
        //console.log(result);
        //console.log("---------------");

        res.send(JSON.stringify(result));

    });
});
router.post('/fillScheduleTemporaryThird', function (req, res, next) {
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

    let str=`SELECT temporary_schedule.id, group_id, studyGroups.name as groupName ,weekday_id, time_id, time.id as timeId, time.time as timeName,
    classroom_id, class.name as className, teacher_id, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, teacher.rank as rank, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day,week, typeSubject.briefly as type_subject, begin_date, end_date  
    FROM temporary_schedule 
    INNER JOIN studyGroups ON studyGroups.id=temporary_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=temporary_schedule.weekday_id 
    INNER JOIN time ON time.id=temporary_schedule.time_id  
    INNER JOIN class ON class.id=temporary_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=temporary_schedule.teacher_id  
    INNER JOIN subject ON subject.id=temporary_schedule.subject_id
	INNER JOIN typeSubject ON typeSubject.id=temporary_schedule.type_subject 
    WHERE group_id IN (SELECT id FROM studyGroups WHERE name=?) AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?`;

    db.all(str, req.body.group,req.body.week,3,req.body.selectDate,req.body.selectDate, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            rows.forEach((row) => {
                result[row.time_id][row.weekday_id] = {
                    id: row.id,
                    timeId: row.timeId,
                    day: row.day,
                    weekdayId: row.dayId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname + " " + row.firstname + " " + row.patronymic+ ", " + row.rank,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    week: row.week,
                    type_subject:row.type_subject,
                    beginDate: row.begin_date,
                    endDate: row.end_date
                };

                // console.log(new Date(row.begin_date),new Date(row.end_date));
                //console.log(result[row.time_id][row.weekday_id]);
                //console.log(row.time_id,row.weekday_id);
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
router.post('/saveChanges', isLoggedIn, function (req, res, next) {
    var db = new TransactionDatabase(
        new sqlite3.Database('./db/sample.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
    );
    let result={};
    res1=[];
    console.log(req.body.typeSubjectSelect);
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

                            db.all(`SELECT id FROM typeSubject WHERE name='${req.body.typeSubjectSelect}'`, (err, rows) => {
                                if (err) {
                                    throw err;
                                }
                                rows.forEach((row) => {
                                    result["typeSubj"] = row.id;
                                });
                                db.all("SELECT week,group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id FROM main_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND additionalPair=?", result["groupId"],result["timeId"],result["dayId"],req.body.numberPair, (err, rows) => {
                                    if (err) {
                                        throw err;
                                    }
                                    rows.forEach((row) => {
                                        res1.push({group_id: row.group_id,  time_id: row.time_id, weekday_id: row.weekday_id, subject_id: row.subject_id, teacher_id: row.teacher_id, classroom_id: row.classroom_id, week: row.week})
                                    });
                                    //console.log(res1.length,res1);
                                    //console.log(req.body.week);
                                    //rows.forEach((row) => {
                                    // res1 = row.week;
                                    //});
                                    //rows.forEach((row) => {
                                    //  res1 = row.week;
                                    //});
                                    //console.log(res1);

                                    if (rows.length == 0) {
                                        if (req.body.week == '') {
                                            db.beginTransaction(function(err, transaction) {
                                                transaction.run(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,additionalPair)
                                    VALUES (?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], '',result["typeSubj"],req.body.numberPair);

                                                transaction.commit(function(err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                            });
                                        }
                                        else{
                                            console.log(rows.length,2);
                                            db.all(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,additionalPair)
                                            VALUES (?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], req.body.week, result["typeSubj"],req.body.numberPair, (err, rows) => {
                                                if (err) {
                                                    throw err;
                                                }

                                            });
                                        }
                                    }
                                    else {

                                        for (var i in res1) {
                                            if ((((req.body.week === res1[i].week) && (req.body.week==='верхняя')) && (res1[i].group_id === result["groupId"]) && (res1[i].weekday_id === result["dayId"]) && (res1[i].time_id === result["timeId"]))) {
                                                //console.log(res1[i].week, req.body.week);
                                                console.log(rows.length, 3);
                                                db.all(`UPDATE main_schedule SET subject_id=?,teacher_id=?,classroom_id=?,type_subject=?
                                       WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?`, result["subjectId"], result["teacherId"], result["classId"],result["typeSubj"], result["groupId"], result["timeId"], result["dayId"], 'верхняя',req.body.numberPair, (err, rows) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                            }
                                            else if ((((req.body.week === res1[i].week) && (req.body.week==='нижняя')) && (res1[i].group_id === result["groupId"]) && (res1[i].weekday_id === result["dayId"]) && (res1[i].time_id === result["timeId"]))) {
                                                //console.log(res1[i].week, req.body.week);
                                                console.log(rows.length, 4);
                                                db.all(`UPDATE main_schedule SET subject_id=?,teacher_id=?,classroom_id=?,type_subject=?
                                       WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?`, result["subjectId"], result["teacherId"], result["classId"], result["typeSubj"], result["groupId"], result["timeId"], result["dayId"], 'нижняя',req.body.numberPair, (err, rows) => {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                            }

                                            /*else if ((rows.length == 2)&&((req.body.week == '') && (res1[i].group_id === result["groupId"]) && (res1[i].weekday_id === result["dayId"]) && (res1[i].time_id === result["timeId"]))) {
                                                // console.log(res1[i].week, req.body.week);
                                                // console.log(rows.length, 5);

                                                db.beginTransaction(function(err, transaction) {
                                                    transaction.run(`UPDATE main_schedule SET subject_id=?,teacher_id=?,classroom_id=?,type_subject=?, week=?
                                           WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?`, result["subjectId"], result["teacherId"], result["classId"], result["typeSubj"],'', result["groupId"], result["timeId"], result["dayId"], 'верхняя',req.body.numberPair);
                                                     transaction.commit(function(err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                        else {
                                                            transaction.run(`DELETE FROM main_schedule WHERE subject_id=? AND teacher_id=? AND classroom_id=? AND type_subject=? AND group_id=? AND time_id=? AND weekday_id=? 
                                                            AND week=? AND additionalPair=?`, result["subjectId"], result["teacherId"], result["classId"], result["typeSubj"], result["groupId"], result["timeId"], result["dayId"], 'нижняя',req.body.numberPair);

                                                            console.log(rows.length, 5);
                                                        }
                                                    });
                                                });
                                            }*/
                                            else if ((rows.length == 1)&&(((req.body.week !== res1[i].week)&& ((res1[i].week==='верхняя')||(res1[i].week==='нижняя')) && ((req.body.week==='верхняя')||(req.body.week==='нижняя'))) && (res1[i].group_id === result["groupId"]) && (res1[i].weekday_id === result["dayId"]) && (res1[i].time_id === result["timeId"]))) {
                                                //console.log(res1[i].week, req.body.week);
                                                console.log(rows.length, 6);

                                                db.all(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,additionalPair)
                                            VALUES (?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], req.body.week, result["typeSubj"],req.body.numberPair, (err, rows) => {
                                                    if (err) {
                                                        throw err;
                                                    }

                                                });
                                            }

                                            else if ((rows.length == 1)&&(req.body.week =='')) {
                                                console.log(rows.length, 7);
                                                db.all(`UPDATE main_schedule SET subject_id=?,teacher_id=?,classroom_id=?,type_subject=?
                                           WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?`, result["subjectId"], result["teacherId"], result["classId"], result["typeSubj"], result["groupId"], result["timeId"], result["dayId"], '', req.body.numberPair, (err, rows) => {
                                                    if (err) {
                                                        throw err;
                                                    }

                                                });
                                            }

                                           /* else if ((rows.length == 1)&& (req.body.week =='') &&((((res1[i].week==='верхняя')||(res1[i].week==='нижняя'))) && (res1[i].group_id === result["groupId"]) && (res1[i].weekday_id === result["dayId"]) && (res1[i].time_id === result["timeId"]))) {
                                                if (res1[i].week === 'верхняя') {
                                                    db.beginTransaction(function(err, transaction) {
                                                        transaction.run(`UPDATE main_schedule SET subject_id=?,teacher_id=?,classroom_id=?,type_subject=?
                                           WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?`, result["subjectId"], result["teacherId"], result["classId"], result["typeSubj"], result["groupId"], result["timeId"], result["dayId"], res1[i].week, req.body.numberPair);
                                                        transaction.run(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,additionalPair)
                                    VALUES (?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], 'нижняя', result["typeSubj"],req.body.numberPair);
                                                        transaction.commit(function(err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                            else {
                                                                console.log(rows.length, 1);
                                                            }
                                                        });
                                                    });
                                                }
                                                if (res1[i].week === 'нижняя') {
                                                    db.beginTransaction(function(err, transaction) {
                                                        transaction.run(`UPDATE main_schedule SET subject_id=?,teacher_id=?,classroom_id=?,type_subject=?
                                           WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?`, result["subjectId"], result["teacherId"], result["classId"],result["typeSubj"], result["groupId"], result["timeId"], result["dayId"], res1[i].week,req.body.numberPair);
                                                        transaction.run(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,additionalPair)
                                    VALUES (?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], 'верхняя',result["typeSubj"],req.body.numberPair);
                                                        transaction.commit(function(err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                            else {
                                                                console.log(rows.length, 1);
                                                            }
                                                        });
                                                    });
                                                }
                                            }*/
                                        }
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
        res.sendStatus(200);
    });
});

router.post('/temporaryChange', isLoggedIn, function (req, res, next) {
    var db = new TransactionDatabase(
        new sqlite3.Database('./db/sample.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
    );
    let result={};
    res1=[];
    //console.log(req.body.typeSubjectSelect);
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

                            db.all(`SELECT id FROM typeSubject WHERE name='${req.body.typeSubjectSelect}'`, (err, rows) => {
                                if (err) {
                                    throw err;
                                }
                                rows.forEach((row) => {
                                    result["typeSubj"] = row.id;
                                });

                                db.all("SELECT begin_date,end_date,week,group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id FROM temporary_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND additionalPair=?  ", result["groupId"],result["timeId"],result["dayId"],req.body.numberPair, (err, rows) => {
                                    if (err) {
                                        throw err;
                                    }
                                    rows.forEach((row) => {
                                        res1.push({group_id: row.group_id,  time_id: row.time_id, weekday_id: row.weekday_id, subject_id: row.subject_id, teacher_id: row.teacher_id, classroom_id: row.classroom_id, week: row.week,begin_date:row.begin_date,end_date:row.end_date})
                                    });
                                    console.log(rows.length);
                                    if (rows.length != 0) {
                                        var k=0;
                                        for (var i in res1) {
                                            var date1 = new Date(res1[i].begin_date);
                                            var date2 = new Date(res1[i].end_date);
                                            var date3 = new Date(req.body.beginDate);
                                            var date4 = new Date(req.body.endDate);
                                            if ((date1 <= date3 && date2 >= date3 && date4 >= date1) || (date4 <= date2 && date4 >= date1 && date2 >= date3) ) {
                                                k++;
                                            }
                                        }
                                           if(k==0) {
                                               if (req.body.week == '') {
                                                   db.beginTransaction(function (err, transaction) {
                                                       console.log(rows.length, 0);
                                                       transaction.run(`INSERT INTO temporary_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,begin_date,end_date,additionalPair)
                                    VALUES (?,?,?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], '', result["typeSubj"], req.body.beginDate, req.body.endDate, req.body.numberPair);
                                                       transaction.commit(function (err) {
                                                           if (err) {
                                                               throw err;
                                                           }

                                                       });
                                                   });
                                               }
                                               else {
                                                   console.log(rows.length, 2);
                                               }
                                           }
                                    }
                                    if (rows.length == 0) {
                                            //var date1=new Date(res1[i].end_date);
                                            //var date2=new Date(req.body.beginDate);
                                                console.log(rows.length, 0);
                                                if (req.body.week == '') {
                                                    db.beginTransaction(function (err, transaction) {
                                                        console.log(rows.length, 0);
                                                        transaction.run(`INSERT INTO temporary_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,begin_date,end_date,additionalPair)
                                    VALUES (?,?,?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], '', result["typeSubj"], req.body.beginDate, req.body.endDate, req.body.numberPair);
                                                        transaction.commit(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });
                                                }
                                                else {
                                                    console.log(rows.length, 2);
                                                    db.all(`INSERT INTO temporary_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,begin_date,end_date,additionalPair)
                                            VALUES (?,?,?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], req.body.week, result["typeSubj"], req.body.beginDate, req.body.endDate, req.body.numberPair, (err, rows) => {
                                                        if (err) {
                                                            throw err;
                                                        }

                                                    });
                                                }

                                    }
                                });
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
                    rank: row.rank,
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
                            var typeSubject = [];
                            db.all('SELECT * FROM typeSubject', (err, rows) => {
                                if (err) {
                                    throw err;
                                }
                                rows.forEach((row) => {
                                    typeSubject.push({id: row.id, name: row.name, briefly: row.briefly});

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
                                res.render('scheduleEdit', {
                                    title: 'Режим редактирования',
                                    subjects: subjects,
                                    teachers: teacher,
                                    classrooms: classrooms,
                                    studyGroups: studyGroups,
                                    times: times,
                                    weekdays: weekdays,
                                    typeSubject:typeSubject,
                                    username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email,userGroups:userGroups
                                });

                            });
                        });
                    });
                });
            });
        });
    });
});


router.post('/deletePair', isLoggedIn, function (req, res, next) {
    var db = new TransactionDatabase(
        new sqlite3.Database('./db/sample.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
    );

    let result={};
    res1=[];
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
                console.log(req.body.selectDate);

                if(req.body.temporary==1){
                    if (req.body.clickedWeek == 'Все') {
                        db.beginTransaction(function(err, transaction) {
                            transaction.run(`DELETE FROM temporary_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?;`, result["groupId"], result["timeId"], result["dayId"], "верхняя",req.body.pair,req.body.selectDate,req.body.selectDate);
                            transaction.run(`DELETE FROM temporary_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?;`, result["groupId"], result["timeId"], result["dayId"], "",req.body.pair,req.body.selectDate,req.body.selectDate);
                            transaction.commit(function(err) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    console.log(0);
                                    transaction.run(`DELETE FROM temporary_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?;`, result["groupId"], result["timeId"], result["dayId"], "нижняя",req.body.pair,req.body.selectDate,req.body.selectDate);
                                }
                            });
                        });
                    }
                    else if (req.body.clickedWeek == 'Верхняя'){
                        db.all(`DELETE FROM temporary_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?;`, result["groupId"], result["timeId"], result["dayId"], "верхняя",req.body.pair,req.body.selectDate,req.body.selectDate, (err, rows) => {
                            console.log(0);
                            if (err) {
                                throw err;
                            }
                        });
                    }
                    else if (req.body.clickedWeek == 'Нижняя'){
                        db.all(`DELETE FROM temporary_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=? AND begin_date<=? AND end_date>=?;`, result["groupId"], result["timeId"], result["dayId"], "нижняя",req.body.pair,req.body.selectDate,req.body.selectDate, (err, rows) => {
                            console.log(0);
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }
                else {
                    if (req.body.clickedWeek == 'Все') {
                        db.beginTransaction(function(err, transaction) {
                            transaction.all(`DELETE FROM main_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?;`, result["groupId"], result["timeId"], result["dayId"], "верхняя",req.body.pair);
                            transaction.all(`DELETE FROM main_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?;`, result["groupId"], result["timeId"], result["dayId"], "",req.body.pair);
                            transaction.commit(function(err) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    transaction.all(`DELETE FROM main_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?;`, result["groupId"], result["timeId"], result["dayId"], "нижняя",req.body.pair);
                                }
                            });
                        });
                    }
                    else if (req.body.clickedWeek == 'Верхняя'){
                        db.all(`DELETE FROM main_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?;`, result["groupId"], result["timeId"], result["dayId"], "верхняя",req.body.pair, (err, rows) => {
                            console.log(0);
                            if (err) {
                                throw err;
                            }
                        });
                    }
                    else if (req.body.clickedWeek == 'Нижняя'){
                        db.all(`DELETE FROM main_schedule WHERE group_id=? AND time_id=? AND weekday_id=? AND week=? AND additionalPair=?;`, result["groupId"], result["timeId"], result["dayId"], "нижняя",req.body.pair, (err, rows) => {
                            console.log(0);
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }
            });
        });
    });
    res.sendStatus(200);
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

router.get('/selectGroup', function(req, res, next) {
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
        res.render('selectGroup', {title: 'Расписание ИМЭИ ИГУ', list: result});
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
                    var username,firstname,lastname,type_user,email,patronymic = '';
                    if (req.user){
                        username = req.user.username;
                        lastname=req.user.lastname;
                        firstname=req.user.firstname;
                        type_user=req.user.type_user;
                        email=req.user.email;
                        patronymic=req.user.patronymic;
                    }

                    res.render('scheduleViewNoSelectGroup', {
                        title: 'Расписание ИМЭИ ИГУ',
                        studyGroups: studyGroups,
                        times: times,
                        weekdays: weekdays,
                        username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email
                    });
                });
            });

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
                    var username,firstname,lastname,type_user,email,patronymic = '';
                    if (req.user){
                        username = req.user.username;
                        lastname=req.user.lastname;
                        firstname=req.user.firstname;
                        type_user=req.user.type_user;
                        email=req.user.email;
                        patronymic=req.user.patronymic;
                    }

                    res.render('scheduleView', {
                        title: 'Расписание ИМЭИ ИГУ',
                        studyGroups: studyGroups,
                        times: times,
                        weekdays: weekdays,
                        val: rows1[0],
                        username: username , lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email
                    });
                });
            });

        });
    });
});
router.get('/conflict', function (req, res, next) {
    res.render('conflict');
});

router.post('/conflictFill', function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    var result = [];

    let str=`SELECT main_schedule.id, group_id, studyGroups.name as groupName ,weekday_id, time_id, time.id as timeId, time.time as timeName,
    classroom_id, class.name as className, teacher_id, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, teacher.rank as rank, subject_id, subject.name as subjectName, 
    weekdays.id as dayId, weekdays.day as day, week, typeSubject.briefly as type_subject, additionalPair, period 
    FROM main_schedule 
    INNER JOIN studyGroups ON studyGroups.id=main_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=main_schedule.weekday_id 
    INNER JOIN time ON time.id=main_schedule.time_id  
    INNER JOIN class ON class.id=main_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=main_schedule.teacher_id  
    INNER JOIN subject ON subject.id=main_schedule.subject_id
	INNER JOIN typeSubject ON typeSubject.id=main_schedule.type_subject 
	INNER JOIN addPair ON addPair.number=main_schedule.additionalPair`;

    db.all(str, (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result.push({
                groupName: row.groupName,
                subject: row.subjectName,
                week: row.week,
                typeSubject:row.type_subject,
                addPair:row.additionalPair,
                teacher: row.lastname+" "+row.firstname+" "+row.patronymic,
                day: row.day,
                time: row.timeName,
                classroom: row.className,
                period: row.period
            });
        });
        res.send(JSON.stringify(result));
    });
});
module.exports = router;