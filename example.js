var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;

function Unique(A)//удаление дублирующихся записей
{
    var n = A.length, k = 0, B = [];
    for (var i = 0; i < n; i++)
    { var j = 0;
        while (j < k && B[j] !== A[i]) j++;
        if (j == k) B[k++] = A[i];
    }
    return B;
}

var validateSubject=[];
var validateTypeSubject=[];
var validateTeacher=[];
var validateRank=[];
var validateClass=[];
var okExcel=[];
var okExcel=[];
var validateGroup=[];

var okGroup=[];
var okTime=[];
var okDay=[];
var okWeek=[];
var okTeacher=[];
var okSubject=[];
var okClass=[];
var okTypeSub=[];
var additionalPair=[];

function Schedules(p, day, listOne, cellTime, pointer, group, typeWeek){   //получаем объект, номер дня, номер листа, время, ячейку с парой, номер группы

    p.group = group;
    console.log(p.group);

    p.day = day;
    console.log(p.day);

    p.typeWeek = typeWeek;
    console.log(p.typeWeek);

    p.time = listOne[XLSX.utils.encode_cell(cellTime)].v;
    console.log(p.time);

    cellSubject = {c: pointer.c, r: pointer.r};
    p.subject = listOne[XLSX.utils.encode_cell(cellSubject)].v;
    console.log(p.subject);

    p.teacher="";
    if (listOne[XLSX.utils.encode_cell({c: pointer.c + 1, r: pointer.r})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c + 1, r: pointer.r})].v!=""){
        cellTeacher = {c: pointer.c + 1, r: pointer.r};
        p.teacher = listOne[XLSX.utils.encode_cell(cellTeacher)].v;
        console.log(p.teacher);
    }

    else{
        cellTeacher = {c: pointer.c + 1, r: pointer.r - 2};
        p.teacher = listOne[XLSX.utils.encode_cell(cellTeacher)].v;
        console.log(p.teacher);
    }

    p.class="";
    if (listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})].v!=""){
        cellClass = {c: pointer.c + 2, r: pointer.r};
        p.class = listOne[XLSX.utils.encode_cell(cellClass)].v;
        console.log(p.class);
    }

    else{
        cellClass = {c: pointer.c + 2, r: pointer.r - 2};
        p.class = listOne[XLSX.utils.encode_cell(cellClass)].v;
        console.log(p.class);
    }

    var s = p.subject;
    var subjType=s.split('.')[0];//получаем тип предмета
    var subj=s.split('.').pop();//убираем тип предмета;

    subjType=subjType.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
    subj=subj.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы

    validateTypeSubject.push(subjType);
    validateTypeSubject=Unique(validateTypeSubject);//убираем повторяющиеся записи
    //console.log(validateTypeSubject);

    validateSubject.push(subj);
    validateSubject = Unique(validateSubject);//убираем повторяющиеся записи
    //console.log(validateSubject);


    var t=p.teacher;
    var teach=t.split(',')[0];
    var rank=t.split(',')[1];
    teach=teach.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
    rank=rank.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
    validateRank.push(rank);
    validateRank=Unique(validateRank);//убираем повторяющиеся записи

    var teacherAndRank = p.teacher.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
    validateTeacher.push(teacherAndRank);
    validateTeacher = Unique(validateTeacher);//убираем повторяющиеся записи


    var c=p.class;
    var classRoom=c.replace(/к[омп\s\S]*к[ласс\s\S]\s{0,}/g,"");//убираем тип "компьютерный класс"


    var reg1=/\d{1,}\s{1}[а-яА-ЯёЁ]{1}/g;
    var n1=classRoom.match(reg1);

    if(n1!=null){
        var n2 = classRoom.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s/g, '');//убираем лишние пробелы
        classRoom=classRoom.replace(reg1,n2.toLowerCase());
        //console.log(n);
        //console.log(n1[0]);
    }
    classRoom=classRoom.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
    //console.log(classRoom);

    validateClass.push(classRoom);
    validateClass= Unique(validateClass);

    var tWeek="";
    if (p.typeWeek==0){
        tWeek="";
    }
    else if (p.typeWeek==1){
        tWeek="верхняя";
    }
    else if (p.typeWeek==2){
        tWeek="нижняя";
    }
    var time=p.time.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');

    okExcel.push({group:p.group, time: time, day: p.day,week:"верхняя", subject: subj, teacher: teach, classRoom: classRoom,typeSubject:subjType, additionalPair:1});
    okGroup.push(p.group);
    okTime.push(time);
    okDay.push(p.day);
    okTeacher.push(teach);
    okSubject.push(subj);
    okClass.push(classRoom);
    okTypeSub.push(subjType);
    additionalPair.push(1);
    console.log(okExcel);
}

function validateAndAdd(){   //проверем наличие данных в бд
    var db = new TransactionDatabase(
        new sqlite3.Database('./db/sample.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
    );
    var resSubj="";
    db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < validateSubject.length; i++) {
            var subject = validateSubject[i];
            transaction.all(`SELECT * FROM subject WHERE name=?`, subject, (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resSubj=row.name;
                });
                if (rows.length!==0) {
                    var index = validateSubject.indexOf(resSubj);
                    validateSubject.splice(index, 1);
                }
            });
        }
        transaction.commit(function (err) {
            if (err) {
                throw err;
            }
            else {
                for (var i = 0; i < validateSubject.length; i++) {
                    transaction.all(`INSERT INTO subject(name) VALUES ('${validateSubject[i]}');`,
                        (err) => {
                            if (err) {
                                throw err;;
                            }
                        }
                    );
                }
            }
        });
    });

    /*var resTypeSubject='';
    db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < validateTypeSubject.length; i++) {
            console.log(validateTypeSubject[i]);
            transaction.all(`SELECT * FROM typeSubject WHERE name=?`,validateTypeSubject[i], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resTypeSubject=row.name;
                });
                if (rows.length!==0) {
                    var index = validateTypeSubject.indexOf(resTypeSubject);
                    validateTypeSubject.splice(index, 1);
                }
            });
        }
        transaction.commit(function (err) {
            if (err) {
                throw err;
            }
            else {

                for (var i = 0; i < validateTypeSubject.length; i++) {
                    var nameSubj="";
                    if(validateTypeSubject[i]==='лек'){
                        nameSubj="лекция";
                    }
                    else if(validateTypeSubject[i]==='пр'){
                        nameSubj="практика";
                    }
                    else if(validateTypeSubject[i]==='лаб'){
                        nameSubj="лабораторная";
                    }
                    else{
                        nameSubj="no";
                    }
                    //console.log(nameSubj);
                    transaction.all(`INSERT INTO typeSubject(name,briefly) VALUES ('${nameSubj}','${validateTypeSubject[i]}');`,
                        (err) => {
                            if (err) {
                                throw err;;
                            }
                        }
                    );
                }
            }
        });

    });*/
    for(var i = 0; i < validateTeacher.length; i++){

        var t1=validateTeacher[i].split(',')[0];
        var r1=validateTeacher[i].split(',')[1].replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');
        var s1 = r1.indexOf('ст'+ 1);
        var s2 = r1.indexOf('преп');
        //console.log(r1);
        if(r1.indexOf('ст'+ 1) && r1.indexOf('преп')+1){
            r1='старший преподаватель';
        }
        validateTeacher[i]=t1+', '+r1;
    }
    for(var i = 0; i < validateRank.length; i++){
        var r1=validateRank[i].replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');
        var s1 = r1.indexOf('ст'+ 1);
        var s2 = r1.indexOf('преп');
        //console.log(r1);
        if(r1.indexOf('ст'+ 1) && r1.indexOf('преп')+1){
            r1='старший преподаватель';
        }

        validateRank[i]=r1;
    }
    validateRank=Unique(validateRank);//убираем повторяющиеся записи

    var resTeach='';
    db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < validateTeacher.length; i++) {
            var t1=validateTeacher[i].split(',')[0];
            var r1=validateTeacher[i].split(',')[1].replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');
            var teacherName = t1.split(' ');
            transaction.all(`SELECT * FROM teacher WHERE lastname='${teacherName[0]}' AND firstname='${teacherName[1]}' AND patronymic='${teacherName[2]}'`, (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resTeach=row.lastname+' '+row.firstname+' '+row.patronymic+', '+row.rank;
                });
                if (rows.length!==0) {
                    var index1 = validateTeacher.indexOf(resTeach);
                    validateTeacher.splice(index1, 1);
                    //console.log(validateTeacher);
                    //console.log(2222, validateSubject.length);
                }
            });
        }
        transaction.commit(function (err) {
            if (err) {
                throw err;
            }
            else {
                for (var i = 0; i < validateTeacher.length; i++) {
                    var t1=validateTeacher[i].split(',')[0];
                    var r1=validateTeacher[i].split(',')[1].replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');
                    var teacherName = t1.split(' ');
                    transaction.all(`INSERT INTO teacher(lastname, firstname, patronymic,rank) VALUES ('${teacherName[0]}', '${teacherName[1]}', '${teacherName[2]}', '${r1}');`,
                        (err) => {
                            if (err) {
                                throw err;;
                            }
                        }
                    );
                }
            }
        });

    });
    var resRank='';
    db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < validateRank.length; i++) {
            transaction.all(`SELECT * FROM rankTeachers WHERE name=?`,validateRank[i], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resRank=row.name;
                });
                if (rows.length!==0) {
                    var index2 = validateRank.indexOf(resRank);
                    validateRank.splice(index2, 1);
                }
            });
        }
        transaction.commit(function (err) {
            if (err) {
                throw err;
            }
            else {
                for (var i = 0; i < validateRank.length; i++) {
                    transaction.all(`INSERT INTO rankTeachers(name) VALUES ('${validateRank[i]}');`,
                        (err) => {
                            if (err) {
                                throw err;;
                            }
                        }
                    );
                }
            }
        });

    });

    var resClass='';
    db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < validateClass.length; i++) {

            transaction.all(`SELECT * FROM class WHERE name=?`,validateClass[i], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resClass=row.name;
                });
                if (rows.length!==0){
                    var index3 = validateClass.indexOf(resClass);
                    validateClass.splice(index3, 1);
                }
            });
        }
        transaction.commit(function (err) {
            if (err) {
                throw err;
            }
            else {
                // console.log(validateClass);
                // console.log(validateClass.length);
                for (var i = 0; i < validateClass.length; i++) {
                    db.all(`INSERT INTO class(name) VALUES ('${validateClass[i]}');`,
                        (err) => {
                            if (err) {
                                throw err;;
                            }
                        }
                    );
                }
            }
        });

    });
    var resGroup='';
    db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < validateGroup.length; i++) {

            transaction.all(`SELECT * FROM studyGroups WHERE name=?`,validateGroup[i], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resGroup=row.name;
                });
                if (rows.length!==0){
                    var index3 = validateGroup.indexOf(resGroup);
                    validateGroup.splice(index3, 1);
                }
            });
        }
        transaction.commit(function (err) {
            if (err) {
                throw err;
            }
            else {
                // console.log(validateClass);
                // console.log(validateClass.length);
                for (var i = 0; i < validateGroup.length; i++) {
                    db.all(`INSERT INTO studyGroups(name,course,briefly) VALUES ('${validateGroup[i]}', SUBSTR('${validateGroup[i]}',3,1), SUBSTR('${validateGroup[i]}',2,4));`,
                        (err) => {
                            if (err) {
                                throw err;;
                            }
                        }
                    );
                }
            }
        });

    });

}

function ScheduleOfExcel(){ //подгрузка расписания excel
    var db = new TransactionDatabase(
        new sqlite3.Database('./db/sample.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
    );
    db.beginTransaction(function(err, transaction) {
        for(var i in okExcel) {
            let str =
                `INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,type_subject,week, additionalPair)
                    SELECT studyGroups.id, time.id,weekdays.id,subject.id,teacher.id,class.id, typeSubject.id, week.name, addPair.id FROM studyGroups, 
                    time, weekdays, subject, 
                    teacher,class, typeSubject, week,addPair
                    WHERE studyGroups.name=? AND time.time=? AND weekdays.id=? AND subject.name=? 
                    AND teacher.lastname=? AND teacher.firstname=? AND teacher.patronymic=? AND class.name=? 
                    AND typeSubject.briefly=? AND week.name=? and addPair.id=?`;
            var teacherName = okExcel[i].teacher.split(' ');

            transaction.all(str, okExcel[i].group, okExcel[i].time, okExcel[i].day, okExcel[i].subject, teacherName[0], teacherName[1], teacherName[2], okExcel[i].classRoom, okExcel[i].typeSubject, okExcel[i].week, okExcel[i].additionalPair, (err, rows) => {
                if (err) {
                    throw err;
                }
            });
        }

        transaction.commit(function (err) {
            if (err) {
                throw err;
            }
            else{
                console.log("ok");
            }
        });

    });

}


function saveScheduleOfExcel(group,time,day,week,subject,teacher,classRoom,typeSubject,additionalPair){ //подгрузка расписания excel
        var db = new TransactionDatabase(
            new sqlite3.Database('./db/sample.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
        );

        let result={};
        res1=[];
        db.all(`SELECT id FROM studyGroups WHERE name=?`,group, (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                result["groupId"]=row.id;
            });

            db.all(`SELECT id FROM time WHERE time=?`,time, (err, rows1) => {
                if (err) {
                    throw err;
                }
                rows1.forEach((row) => {
                    result["timeId"] = row.id;
                });

                db.all(`SELECT id FROM weekdays WHERE id=?`,day, (err, rows2) => {
                    if (err) {
                        throw err;
                    }
                    rows2.forEach((row) => {
                        result["dayId"] = row.id;
                    });
                    db.all(`SELECT id FROM subject WHERE name=?`,subject, (err, rows3) => {
                        if (err) {
                            throw err;
                        }
                        rows3.forEach((row) => {
                            result["subjectId"] = row.id;
                        });
                        var teacherName = teacher.split(' ');
                        db.all(`SELECT id FROM teacher WHERE lastname=? AND firstname=? AND patronymic=?`,teacherName[0],teacherName[1],teacherName[2], (err, rows4) => {
                            if (err) {
                                throw err;
                            }
                            rows4.forEach((row) => {
                                result["teacherId"] = row.id;
                            });
                            db.all(`SELECT id FROM class WHERE name=?`,classRoom, (err, rows5) => {
                                if (err) {
                                    throw err;
                                }
                                rows5.forEach((row) => {
                                    result["classId"] = row.id;
                                });

                                db.all(`SELECT id FROM typeSubject WHERE briefly=?`,typeSubject, (err, rows6) => {
                                    if (err) {
                                        throw err;
                                    }
                                    rows.forEach((row) => {
                                        result["typeSubj"] = row.id;
                                        });
                                    okExcel1.push({group:result["groupId"], time: result["timeId"], day: result["dayId"],week:week, subject: result["subjectId"], teacher: result["teacherId"], classRoom: result["classId"],typeSubject:result["typeSubj"], additionalPair:1});

                                    //console.log(okExcel1);
                                    /*if (rows.length == 0) {
                                        //console.log(week);
                                        if (week == "") {
                                            db.beginTransaction(function (err, transaction) {
                                                transaction.run(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,additionalPair)
                                    VALUES (?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], 'верхняя', result["typeSubj"], additionalPair);
                                                console.log(rows.length, 1);
                                                transaction.commit(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    else {
                                                        console.log(rows.length, 2);
                                                        db.all(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,additionalPair)
                                    VALUES (?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], 'нижняя', result["typeSubj"], additionalPair);
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            console.log(rows.length, 3);
                                            db.all(`INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,week,type_subject,additionalPair)
                                            VALUES (?,?,?,?,?,?,?,?,?)`, result["groupId"], result["timeId"], result["dayId"], result["subjectId"], result["teacherId"], result["classId"], week, result["typeSubj"], additionalPair, (err, rows) => {
                                                if (err) {
                                                    throw err;
                                                }

                                            });
                                        }
                                    }*/
                                    });
                                });
                            });
                        });
                    });
                });
            });
}


let XLSX = require("xlsx");
let workbook = XLSX.readFile("./files/Schedules.xls");
let sheet_name_list = workbook.SheetNames;
//console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])); //1 лист вывести
let numberList = [];
let merges = [];
for (let i = 0;i<4; i++){
    numberList.push(workbook.Sheets[sheet_name_list[i]]);  //номер листа
    merges[i] = numberList[i]['!merges'];
}

function Search(cel, n){
    for (var i = 0; i < merges[n].length; i++) {
        if (merges[n][i].s.c== cel.s.c && merges[n][i].s.r== cel.s.r && merges[n][i].e.c== cel.e.c && merges[n][i].e.r>= cel.e.r) {
            return true;
        }
    }
    return false;
}

for (let k = 0; k<numberList.length; k++){
    let listOne = numberList[k];
    const offsetY = 5;  //отступы до названия 1 группы
    const offsetX = 2;
    let begin = {c: 0, r: 0};

    let cell = {c: begin.c + offsetX, r: begin.r + offsetY};  //адрес 2 5
    //console.log(cell);
    let cellName = XLSX.utils.encode_cell(cell);    //значение
    //console.log(listOne[cellName].v);
    let kurs1 = [];
    kurs1.push(listOne[cellName].v);
    const offsetGroup = 3;  // отступ от группы до группы
    //console.log(listOne[XLSX.utils.encode_cell({c:cellp.c + offsetGroup, r:cell.r})].v);
    cell.c += offsetGroup;
    cellName = XLSX.utils.encode_cell(cell);
    while (listOne[cellName]!=undefined){   //считываем названия групп в массив
        kurs1.push(listOne[cellName].v);
        validateGroup.push(listOne[cellName].v);
        cell.c += offsetGroup;
        cellName = XLSX.utils.encode_cell(cell);
    }
   // console.log(kurs1);

    let p = [];
    const offsetY1 = 6;  //отступы до названия времени
    const offsetX1 = 1;
    const offsetTime = 4;  //отступ от времени до времени
    const offsetLecture = 2;    //отступ до следующей ячейки
    let cellTime = {c: begin.c + offsetX1, r: begin.r + offsetY1};  //значение 1 6
    let pointer = {c: cellTime.c + 1, r: cellTime.r};   //по этой ячейке проверяем наличие пары
    for(let j = 0; j<kurs1.length; j++){
        let day = 1;
        let group = kurs1[j];
        for(let i = 0; listOne[XLSX.utils.encode_cell(cellTime)]!=undefined; day++){
            if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("08.30") >= 0){
                if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                    p[i]={};
                    Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                    i++;
                    p[i]={};
                    Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                    i++;
                }
                if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v=="")){   // на верхней неделе пары есть, на нижней - нет
                    p[i]={};
                    Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                    i++;
                }
                if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v=="")){   // на нижней неделе пары есть, на верхней - нет
                    p[i]={};
                    Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                    i++;
                }
                if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)){ // нет разделения на нижнюю и верхнюю неделю
                    p[i]={};
                    Schedules(p[i], day, listOne, cellTime, pointer, group, 0);
                    i++;
                }
                cellTime.r += offsetTime;
                pointer.r += offsetTime;
            }

            if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("10.10") >= 0){
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v=="")){   // на верхней неделе пары есть, на нижней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                    }
                    if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v=="")){   // на нижней неделе пары есть, на верхней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)){ // нет разделения на нижнюю и верхнюю неделю
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 0);
                        i++;
                    }
                    cellTime.r += offsetTime;
                    pointer.r += offsetTime;
                }

            if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("11.50") >= 0){
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v=="")){   // на верхней неделе пары есть, на нижней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                    }
                    if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v=="")){   // на нижней неделе пары есть, на верхней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)){ // нет разделения на нижнюю и верхнюю неделю
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 0);
                        i++;
                    }
                    cellTime.r += offsetTime;
                    pointer.r += offsetTime;
                }

            if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("13.50") >= 0){
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + 2})].v=="")){   // на верхней неделе пары есть, на нижней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                    }
                    if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v=="")){   // на нижней неделе пары есть, на верхней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)){ // нет разделения на нижнюю и верхнюю неделю
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 0);
                        i++;
                    }
                    cellTime.r += offsetTime;
                    pointer.r += offsetTime;
                }

            if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("15.30") >= 0){
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v=="")){   // на верхней неделе пары есть, на нижней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                    }
                    if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v=="")){   // на нижней неделе пары есть, на верхней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)){ // нет разделения на нижнюю и верхнюю неделю
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 0);
                        i++;
                    }
                    cellTime.r += offsetTime;
                    pointer.r += offsetTime;
                }

            if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("17.10") >= 0){
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v=="")){   // на верхней неделе пары есть, на нижней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 1);
                        i++;
                    }
                    if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v=="")){   // на нижней неделе пары есть, на верхней - нет
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        i++;
                    }
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)){ // нет разделения на нижнюю и верхнюю неделю
                        p[i]={};
                        Schedules(p[i], day, listOne, cellTime, pointer, group, 0);
                        i++;
                    }
                    cellTime.r += offsetTime;
                    pointer.r += offsetTime;
                }
        }
        cellTime = {c: begin.c + offsetX1, r: begin.r + offsetY1};
        pointer = {c: pointer.c + offsetGroup, r: cellTime.r};
    }
}
//console.log(validateGroup)
validateAndAdd();
ScheduleOfExcel();
//var c=excelGroup();

//var i=0;
/*for(var i in okExcel){
    //if (i<30) {
   var t= saveScheduleOfExcel(okExcel[i].group, okExcel[i].time, okExcel[i].day, okExcel[i].week, okExcel[i].subject, okExcel[i].teacher, okExcel[i].classRoom, okExcel[i].typeSubject, okExcel[i].additionalPair);
   // i++;
    console.log(t);
}*/
   // }


//module.exports.readSchedules = readSchedules;