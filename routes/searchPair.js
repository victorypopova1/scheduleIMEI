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


router.get('/searchPair', function(req, res, next) {
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

                            res.render('searchPair', {
                                title: 'Поиск',
                                subjects: subjects,
                                teachers: teacher,
                                classrooms: classrooms,
                                studyGroups: studyGroups,
                                times: times,
                                weekdays: weekdays,
                               });
                        });
                    });
                });
            });
        });
    });
});

router.post('/searchPairSTC', function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });

    console.log(req.body.subject);
    result=[];
    resultT=[];
    resultV=[];
    okResult=[];
    let str=`
    SELECT main_schedule.id, studyGroups.name as groupName,weekdays.day as weekday,weekdays.id as weekdayId, time.time as timeName, 
    class.name as className, teacher.patronymic as patronymic, teacher.lastname as lastname, 
    teacher.firstname as firstname, teacher.rank as rank, subject.name as subjectName,week, typeSubject.briefly as type_subject, additionalPair  
    FROM main_schedule 
    INNER JOIN studyGroups ON studyGroups.id=main_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=main_schedule.weekday_id 
    INNER JOIN time ON time.id=main_schedule.time_id  
    INNER JOIN class ON class.id=main_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=main_schedule.teacher_id  
    INNER JOIN subject ON subject.id=main_schedule.subject_id
    INNER JOIN typeSubject ON typeSubject.id=main_schedule.type_subject
	`;
    let valid=`
    SELECT temporary_schedule.id, studyGroups.name as groupName,weekdays.day as weekday,weekdays.id as weekdayId, time.time as timeName, 
    class.name as className, teacher.patronymic as patronymic, teacher.lastname as lastname, teacher.firstname as firstname, teacher.rank as rank, 
    subject.name as subjectName,week, typeSubject.briefly as type_subject,
    begin_date, end_date, additionalPair FROM temporary_schedule 
    INNER JOIN studyGroups ON studyGroups.id=temporary_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=temporary_schedule.weekday_id 
    INNER JOIN time ON time.id=temporary_schedule.time_id  
    INNER JOIN class ON class.id=temporary_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=temporary_schedule.teacher_id  
    INNER JOIN subject ON subject.id=temporary_schedule.subject_id
    INNER JOIN typeSubject ON typeSubject.id=temporary_schedule.type_subject 
    WHERE begin_date<=? AND end_date>=?
	`;

    let temporary=`
    SELECT temporary_schedule.id, studyGroups.name as groupName,weekdays.day as weekday,weekdays.id as weekdayId, time.time as timeName, 
    class.name as className, teacher.patronymic as patronymic, teacher.lastname as lastname, teacher.firstname as firstname, teacher.rank as rank, 
    subject.name as subjectName,week, typeSubject.briefly as type_subject,
    begin_date, end_date, additionalPair FROM temporary_schedule 
    INNER JOIN studyGroups ON studyGroups.id=temporary_schedule.group_id  
    INNER JOIN weekdays ON weekdays.id=temporary_schedule.weekday_id 
    INNER JOIN time ON time.id=temporary_schedule.time_id  
    INNER JOIN class ON class.id=temporary_schedule.classroom_id  
    INNER JOIN teacher ON teacher.id=temporary_schedule.teacher_id  
    INNER JOIN subject ON subject.id=temporary_schedule.subject_id
    INNER JOIN typeSubject ON typeSubject.id=temporary_schedule.type_subject 
	`;

    let str1=`WHERE teacher_id IN (SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?) 
	AND subject_id IN (SELECT id FROM subject WHERE name=?) AND classroom_id IN (SELECT id FROM class WHERE name=?)  
	ORDER BY weekdayId, timeName`;

    let temporary1=`WHERE begin_date<=? AND end_date>=? AND teacher_id IN (SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?) 
	AND subject_id IN (SELECT id FROM subject WHERE name=?) AND classroom_id IN (SELECT id FROM class WHERE name=?)  
	ORDER BY weekdayId, timeName`;

    var teacherName = req.body.teacher.split(' ');
    if(req.body.teacher!="" && req.body.subject!="" && req.body.class!="") {
        db.all(str+str1, teacherName[0], teacherName[1], teacherName[2], req.body.subject, req.body.class, (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(0);
            rows.forEach((row) => {
                result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                    patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                })
            });
                db.all(valid,req.body.searchPairDate, req.body.searchPairDate, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log(1);
                    rows.forEach((row) => {
                        resultV.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                            patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                        })
                    });
            for(var j in resultV){
                for(var i in result) {
                        if(result[i].group===resultV[j].group && result[i].weekday===resultV[j].weekday && result[i].time===resultV[j].time
                            && result[i].week===resultV[j].week && result[i].week===resultV[j].week && (result[i].additionalPair===resultV[j].additionalPair || resultV[j].additionalPair===0)) {
                            delete result.splice(i,1);
                            console.log(2);
                        }
                    }
                }
                    db.all(temporary+temporary1,req.body.searchPairDate, req.body.searchPairDate, teacherName[0], teacherName[1], teacherName[2], req.body.subject, req.body.class, (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        console.log(1);
                        rows.forEach((row) => {
                            console.log(row.subject);
                            result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                                patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                            })
                        });
            console.log(result);
            //console.log("---------------");
            res.send(JSON.stringify(result));
        });
        });
        });
    }
    let str2=`
	WHERE teacher_id IN (SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?) 
	ORDER BY weekdayId, timeName`;
    let temporary2=`WHERE begin_date<=? AND end_date>=? AND teacher_id IN (SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?) 
	ORDER BY weekdayId, timeName`;

    if(req.body.teacher!="" && req.body.subject=="" && req.body.class=="") {
        db.all(str+str2, teacherName[0], teacherName[1], teacherName[2], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(0);
            rows.forEach((row) => {
                result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                    patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                })
            });
            db.all(valid,req.body.searchPairDate, req.body.searchPairDate, (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log(1);
                rows.forEach((row) => {
                    resultV.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                        patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                    })
                });
                for(var j in resultV){
                    for(var i in result) {
                        if(result[i].group===resultV[j].group && result[i].weekday===resultV[j].weekday && result[i].time===resultV[j].time
                            && result[i].week===resultV[j].week && result[i].week===resultV[j].week && (result[i].additionalPair===resultV[j].additionalPair || resultV[j].additionalPair===0)) {
                            delete result.splice(i,1);
                            console.log(2);
                        }
                    }
                }
                db.all(temporary+temporary2,req.body.searchPairDate, req.body.searchPairDate, teacherName[0], teacherName[1], teacherName[2], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log(1);
                    rows.forEach((row) => {
                        console.log(row.subject);
                        result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                            patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                        })
                    });
                    console.log(result);
                    //console.log("---------------");
                    res.send(JSON.stringify(result));
                });
            });

        });
    }

    let str3=`
	WHERE subject_id IN (SELECT id FROM subject WHERE name=?) 
	ORDER BY weekdayId, timeName`;
    let temporary3=`WHERE begin_date<=? AND end_date>=? AND subject_id IN (SELECT id FROM subject WHERE name=?) 
	ORDER BY weekdayId, timeName`;
    if(req.body.teacher=="" && req.body.subject!="" && req.body.class=="") {
        db.all(str+str3, req.body.subject, (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(0);
            rows.forEach((row) => {
                result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                    patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                })
            });
            db.all(valid,req.body.searchPairDate, req.body.searchPairDate, (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log(1);
                rows.forEach((row) => {
                    resultV.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                        patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                    })
                });
                for(var j in resultV){
                    for(var i in result) {
                        if(result[i].group===resultV[j].group && result[i].weekday===resultV[j].weekday && result[i].time===resultV[j].time
                            && result[i].week===resultV[j].week && result[i].week===resultV[j].week && (result[i].additionalPair===resultV[j].additionalPair || resultV[j].additionalPair===0)) {
                            delete result.splice(i,1);
                            console.log(2);
                        }
                    }
                }
                db.all(temporary+temporary3,req.body.searchPairDate, req.body.searchPairDate,req.body.subject, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log(1);
                    rows.forEach((row) => {
                        console.log(row.subject);
                        result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                            patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                        })
                    });
                    console.log(result);
                    //console.log("---------------");
                    res.send(JSON.stringify(result));
                });
            });

        });
    }

    let str4=`
	WHERE classroom_id IN (SELECT id FROM class WHERE name=?)  
	ORDER BY weekdayId, timeName`;
    let temporary4=`WHERE begin_date<=? AND end_date>=? AND classroom_id IN (SELECT id FROM class WHERE name=?)
	ORDER BY weekdayId, timeName`;
    if(req.body.teacher=="" && req.body.subject=="" && req.body.class!="") {
        db.all(str+str4, req.body.class, (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(0);
            rows.forEach((row) => {
                result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                    patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                })
            });
            db.all(valid,req.body.searchPairDate, req.body.searchPairDate, (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log(1);
                rows.forEach((row) => {
                    resultV.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                        patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                    })
                });
                for(var j in resultV){
                    for(var i in result) {
                        if(result[i].group===resultV[j].group && result[i].weekday===resultV[j].weekday && result[i].time===resultV[j].time
                            && result[i].week===resultV[j].week && result[i].week===resultV[j].week && (result[i].additionalPair===resultV[j].additionalPair || resultV[j].additionalPair===0)) {
                            delete result.splice(i,1);
                            console.log(2);
                        }
                    }
                }
                db.all(temporary+temporary4,req.body.searchPairDate, req.body.searchPairDate, req.body.class, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log(1);
                    rows.forEach((row) => {
                        console.log(row.subject);
                        result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                            patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                        })
                    });
                    console.log(result);
                    //console.log("---------------");
                    res.send(JSON.stringify(result));
                });
            });
        });
    }

    let str5=`
	WHERE teacher_id IN (SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?) 
	AND subject_id IN (SELECT id FROM subject WHERE name=?)  
	ORDER BY weekdayId, timeName`;
    let temporary5=`WHERE begin_date<=? AND end_date>=? AND teacher_id IN (SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?) 
	AND subject_id IN (SELECT id FROM subject WHERE name=?)
	ORDER BY weekdayId, timeName`;
    if(req.body.teacher!="" && req.body.subject!="" && req.body.class=="") {
        db.all(str+str5, teacherName[0], teacherName[1], teacherName[2], req.body.subject, (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(0);
            rows.forEach((row) => {
                result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                    patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                })
            });
            db.all(valid,req.body.searchPairDate, req.body.searchPairDate, (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log(1);
                rows.forEach((row) => {
                    resultV.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                        patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                    })
                });
                for(var j in resultV){
                    for(var i in result) {
                        if(result[i].group===resultV[j].group && result[i].weekday===resultV[j].weekday && result[i].time===resultV[j].time
                            && result[i].week===resultV[j].week && result[i].week===resultV[j].week && (result[i].additionalPair===resultV[j].additionalPair || resultV[j].additionalPair===0)) {
                            delete result.splice(i,1);
                            console.log(2);
                        }
                    }
                }
                db.all(temporary+temporary5,req.body.searchPairDate, req.body.searchPairDate, teacherName[0], teacherName[1], teacherName[2], req.body.subject, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log(1);
                    rows.forEach((row) => {
                        console.log(row.subject);
                        result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                            patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                        })
                    });
                    console.log(result);
                    //console.log("---------------");
                    res.send(JSON.stringify(result));
                });
            });
        });
    }

    let str6=`
	WHERE teacher_id IN (SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?) 
	AND classroom_id IN (SELECT id FROM class WHERE name=?)  
	ORDER BY weekdayId, timeName`;
    let temporary6=`WHERE begin_date<=? AND end_date>=? AND teacher_id IN (SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?) 
	AND classroom_id IN (SELECT id FROM class WHERE name=?)
	ORDER BY weekdayId, timeName`;
    if(req.body.teacher!="" && req.body.subject=="" && req.body.class!="") {
        db.all(str+str6, teacherName[0], teacherName[1], teacherName[2], req.body.class, (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(0);
            rows.forEach((row) => {
                result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                    patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                })
            });
            db.all(valid,req.body.searchPairDate, req.body.searchPairDate, (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log(1);
                rows.forEach((row) => {
                    resultV.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                        patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                    })
                });
                for(var j in resultV){
                    for(var i in result) {
                        if(result[i].group===resultV[j].group && result[i].weekday===resultV[j].weekday && result[i].time===resultV[j].time
                            && result[i].week===resultV[j].week && result[i].week===resultV[j].week && (result[i].additionalPair===resultV[j].additionalPair || resultV[j].additionalPair===0)) {
                            delete result.splice(i,1);
                            console.log(2);
                        }
                    }
                }
                db.all(temporary+temporary6,req.body.searchPairDate, req.body.searchPairDate, teacherName[0], teacherName[1], teacherName[2], req.body.class, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log(1);
                    rows.forEach((row) => {
                        console.log(row.subject);
                        result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                            patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                        })
                    });
                    console.log(result);
                    //console.log("---------------");
                    res.send(JSON.stringify(result));
                });
            });
        });
    }

    let str7=`
	WHERE subject_id IN (SELECT id FROM subject WHERE name=?) AND classroom_id IN (SELECT id FROM class WHERE name=?)  
	ORDER BY weekdayId, timeName`;
    let temporary7=`WHERE begin_date<=? AND end_date>=? AND subject_id IN (SELECT id FROM subject WHERE name=?) AND classroom_id IN (SELECT id FROM class WHERE name=?)
	ORDER BY weekdayId, timeName`;
    if(req.body.teacher=="" && req.body.subject!="" && req.body.class!="") {
        db.all(str+str7,req.body.subject, req.body.class, (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(0);
            rows.forEach((row) => {
                result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                    patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                })
            });
            db.all(valid,req.body.searchPairDate, req.body.searchPairDate, (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log(1);
                rows.forEach((row) => {
                    resultV.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                        patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                    })
                });
                for(var j in resultV){
                    for(var i in result) {
                        if(result[i].group===resultV[j].group && result[i].weekday===resultV[j].weekday && result[i].time===resultV[j].time
                            && result[i].week===resultV[j].week && result[i].week===resultV[j].week && (result[i].additionalPair===resultV[j].additionalPair || resultV[j].additionalPair===0)) {
                            delete result.splice(i,1);
                            console.log(2);
                        }
                    }
                }
                db.all(temporary+temporary7,req.body.searchPairDate, req.body.searchPairDate, req.body.subject, req.body.class, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log(1);
                    rows.forEach((row) => {
                        console.log(row.subject);
                        result.push({id: row.id, group: row.groupName, weekday: row.weekday, time: row.timeName, subject: row.subjectName, lastname: row.lastname, firstname: row.firstname,
                            patronymic: row.patronymic, rank: row.rank, className: row.className, week: row.week, type_subject: row.type_subject,additionalPair:row.additionalPair
                        })
                    });
                    console.log(result);
                    //console.log("---------------");
                    res.send(JSON.stringify(result));
                });
            });
        });
    }

});

module.exports = router;