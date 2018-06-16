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

isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/schedule');
    }
};

router.get('/sessionTableEdit',isLoggedIn, function (req, res) {
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
                            var typeEx=[];
                            db.all('SELECT * FROM typeEx', (err, rows) => {
                                if (err) {
                                    throw err;
                                }
                                rows.forEach((row) => {
                                    typeEx.push({id: row.id, typeEx: row.typeEx});

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
                                res.render('sessionTableEdit', {
                                    title: 'Расписание сессии',
                                    subjects: subjects,
                                    teachers: teacher,
                                    classrooms: classrooms,
                                    studyGroups: studyGroups,
                                    times: times,
                                    weekdays: weekdays,
                                    typeEx: typeEx,
                                    username: username, lastname: lastname, patronymic: patronymic, firstname: firstname, type_user: type_user,email:email
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.post('/fillSession',isLoggedIn, function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
            let str = `SELECT sessionTable.id, group_id, studyGroups.name as groupName , timeId, time.id as time_id, time.time as timeName,
    classroomId, class.name as className, teacherId, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, subjectId, subject.name as subjectName, typeId, typeEx.id as typeExId, typeEx.typeEx as typeExName 
    FROM sessionTable 
    INNER JOIN studyGroups ON studyGroups.id=sessionTable.groupId   
    INNER JOIN time ON time.id=sessionTable.timeId  
    INNER JOIN class ON class.id=sessionTable.classroomId  
    INNER JOIN teacher ON teacher.id=sessionTable.teacherId  
    INNER JOIN subject ON subject.id=sessionTable.subjectId 
    INNER JOIN typeEx ON typeEx.id=sessionTable.typeId  
    WHERE groupId IN (SELECT id FROM studyGroups WHERE name=?) `;
        });
    let result=[];
    db.all(str, req.body.group, (err, rows) => {
        if (err) {
        }else {
            rows.forEach((row) => {
                result.push= {
                    id: row.id,
                    timeId: row.timeId,
                    groupName: row.groupName,
                    timeName: row.timeName,
                    className: row.className,
                    teacherName: row.lastname+" "+row.firstname+" "+row.patronymic,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    typeExName: row.typeExName
                };
                //console.log(result[row.time_id][row.weekday_id] );
            });
        };
        let resLength=result.length;
        result.push={resLength:resLength};
        //console.log(result);
        //console.log("---------------");
        res.send(JSON.stringify(result));
    });
});

router.post('/addInSessionTable',isLoggedIn, function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    let result={};
    db.all(`SELECT id FROM studyGroups WHERE name ='${req.body.selectGroupSession}'`, (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            result["groupId"]=row.id;
        });
        db.all(`SELECT id FROM typeEx WHERE typeEx ='${req.body.selectTypeSession}'`, (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                result["typeId"] = row.id;
            });
            db.all(`SELECT id FROM subject WHERE name='${req.body.selectSubjectSession}'`, (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    result["subjectId"] = row.id;
                });
                var teacherName = req.body.selectTeacherSession.split(' ');
                db.all(`SELECT id FROM teacher WHERE lastname='${teacherName[0]}' AND firstname='${teacherName[1]}' AND patronymic='${teacherName[2]}'`, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    rows.forEach((row) => {
                        result["teacherId"] = row.id;
                    });
                    db.all(`SELECT id FROM class WHERE name='${req.body.selectClassSession}'`, (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        rows.forEach((row) => {
                            result["classId"] = row.id;
                        });
                        db.all(`INSERT INTO sessionTable (groupId,typeId,subjectId,teacherId,classroomId)
                                VALUES (?,?,?,?,?)`, result["groupId"], result["typeId"], result["subjectId"], result["teacherId"], result["classId"], (err, rows) => {
                            if (err) {
                                throw err;
                            }
                        });
                    });
                });
            });
        });
        res.sendStatus(200);
    });
});

router.post('/fillSessionTable',isLoggedIn, function (req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    //req.body.group  - AJAX data from /table
    var result =[];

    let str=`SELECT sessionTable.id, groupId, studyGroups.name as groupName,
    classroomId, class.name as className, teacherId, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, subjectId, subject.name as subjectName, typeId, typeEx.typeEx as typeEx   
    FROM sessionTable  
    INNER JOIN studyGroups ON studyGroups.id=sessionTable.groupId  
    INNER JOIN class ON class.id=sessionTable.classroomId  
    INNER JOIN teacher ON teacher.id=sessionTable.teacherId  
    INNER JOIN subject ON subject.id=sessionTable.subjectId 
    INNER JOIN typeEx ON typeEx.id=sessionTable.typeId 
    WHERE groupId IN (SELECT id FROM studyGroups WHERE name=?) `;

    db.all(str, req.body.group, (err, rows) => {
        if (err) {
        }else {
            rows.forEach((row) => {
                result.push({
                    id: row.id,
                    groupName: row.groupName,
                    className: row.className,
                    teacherName: row.lastname+" "+row.firstname+" "+row.patronymic,
                    lastname: row.lastname,
                    firstname: row.firstname,
                    patronymic: row.patronymic,
                    subjectName: row.subjectName,
                    typeEx: row.typeEx,
                    typeEx:row.typeId
                });
            });
        };
        res.send(JSON.stringify(result));
    });
});

module.exports = router;