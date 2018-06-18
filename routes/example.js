var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
let XLSX = require("xlsx");

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
var okExcel1=[];
var validateGroup=[];
let p = []; //массив, куда заносим всю информацию о паре
let number = 0;

function Schedules(day, listOne, cellTime, pointer, group, typeWeek){   //получаем объект, номер дня, номер листа, время, ячейку с парой, номер группы
    let pair = [];
    console.log(pointer);
    pair = (listOne[XLSX.utils.encode_cell(pointer)].v + " ").split("\n");
    delete pair[pair.indexOf(" ")];
    pair = pair.filter(Boolean);
    let teac = [];
    if (listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})].v!="")
        teac = (listOne[XLSX.utils.encode_cell({c: pointer.c + 1, r: pointer.r})].v + " ").split("\n");
    delete teac[teac.indexOf(" ")];
    teac = teac.filter(Boolean);
    let classroom = [];
    if (listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})].v!="")
        classroom = (listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})].v + " ").split("\n");
    delete classroom[classroom.indexOf(" ")];
    classroom = classroom.filter(Boolean);

    for (let h = 0; h < pair.length; h++){
        p[number]={};
        p[number].group = group;
        console.log(p[number].group);

        p[number].day = day;
        console.log(p[number].day);

        p[number].typeWeek = typeWeek;
        console.log(p[number].typeWeek);

        p[number].time = listOne[XLSX.utils.encode_cell(cellTime)].v;
        console.log(p[number].time);

        p[number].subject = pair[h];
        console.log(p[number].subject);

        if (listOne[XLSX.utils.encode_cell({c: pointer.c + 1, r: pointer.r})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c + 1, r: pointer.r})].v!="")
            p[number].teacher = teac[h];

        else
            p[number].teacher = p[number-1].teacher;
        console.log(p[number].teacher);

        if (listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c + 2, r: pointer.r})].v!="")
            p[number].class = classroom[h];

        else
            p[number].class = p[number-1].class;
        console.log(p[number].class);

        p[number].marker = h+1;
        console.log(p[number].marker);

        var s = p[number].subject;
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


        var t=p[number].teacher;
        var teach;
        var rank;

        if(t!=undefined) {
            if (t.indexOf(',') != -1) {
            teach = t.split(',')[0];
            rank = t.split(',')[1];
            }
        }
        else{
            teach = "преподаватель";
            rank = "";
        }
        teach=teach.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
        rank=rank.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
        validateRank.push(rank);
        validateRank=Unique(validateRank);//убираем повторяющиеся записи


        var teacherAndRank;
        if(t!=undefined) {
            if (t.indexOf(',') != -1) {
                teacherAndRank =p[number].teacher.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
            }
        }
        else{
            teacherAndRank = "";
        }

        validateTeacher.push(teacherAndRank);
        validateTeacher = Unique(validateTeacher);//убираем повторяющиеся записи


        var c=p[number].class;
        var classRoom=c.replace(/к[омп\s\S]*к[ласс\s\S]/g,"").replace(/^\.*/gm, '');//убираем тип "компьютерный класс"


        var reg1=/\d{1,}[а-яА-ЯёЁ]{1}/g;
        var n1=classRoom.match(reg1);

        if(n1!=null){
            var n2 = classRoom.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s/g, '');//убираем лишние пробелы
            //classRoom=classRoom.replace(/(.*)\s*/g).replace(/(.*)\s*$/g);
            classRoom=classRoom.replace(/\s/g, "").replace(reg1,n2.toLowerCase());
            //console.log(n);
            //console.log(n1[0]);
        }

        classRoom=classRoom.replace(/^\s*/,'').replace(/\s*$/,'').replace(/^\.*/g, '');//убираем лишние пробелы
        classRoom=classRoom.replace(/^\s*/,'').replace(/\s*$/,'').replace(/^\.*/g, '');//убираем лишние пробелы
        if(classRoom.length==5 && classRoom.indexOf(" ")!=-1){
            classRoom=classRoom.replace(/\s/g, '');
        }
        //console.log(classRoom);

        validateClass.push(classRoom);
        validateClass= Unique(validateClass);

        var time=p[number].time.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');
        var week="";
        if (p[number].typeWeek==0){
            week="";
        }
        else if (p[number].typeWeek==1){
            week="верхняя";
        }
        else if (p[number].typeWeek==2){
            week="нижняя";
           }
        okExcel.push({group:p[number].group, time: time, day: p[number].day,week:week, subject: subj, teacher: teach, classRoom: classRoom,typeSubject:subjType, additionalPair:p[number].marker});

        console.log(okExcel);
        number++;
    }

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

    var resTypeSubject='';
    db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < validateTypeSubject.length; i++) {
            console.log(validateTypeSubject[i]);
            transaction.all(`SELECT * FROM typeSubject WHERE briefly=?`,validateTypeSubject[i], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resTypeSubject=row.briefly;
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

    });
    for(var i = 0; i < validateTeacher.length; i++){
        var t1;
        var r1;
        if(validateTeacher[i]!=undefined) {
            if (validateTeacher[i].indexOf(',') != -1) {
                t1=validateTeacher[i].split(',')[0];
                r1=validateTeacher[i].split(',')[1].replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');
            }
        }
        else {
            t1="1"+" "+"1" +" "+"1";
            r1="";
        }

        var s1 = r1.indexOf('ст'+ 1);
        var s2 = r1.indexOf('преп');
        //console.log(r1);
        if(r1.indexOf('ст'+ 1) && r1.indexOf('преп')+1){
            r1='старший преподаватель';
        }
        validateTeacher[i]=t1+', '+r1;
    }
    validateTeacher = Unique(validateTeacher);
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
    /*db.beginTransaction(function(err, transaction) {
        for(var i in okExcel1) {
            let str =
                `INSERT INTO main_schedule (group_id,time_id,weekday_id,subject_id,teacher_id,classroom_id,type_subject,week, additionalPair)
                    SELECT studyGroups.id, time.id,weekdays.id,subject.id,teacher.id,class.id, typeSubject.id, week.name, addPair.id FROM studyGroups, 
                    time, weekdays, subject, 
                    teacher,class, typeSubject, week,addPair
                    WHERE studyGroups.name=? AND time.time=? AND weekdays.id=? AND subject.name=? 
                    AND teacher.lastname=? AND teacher.firstname=? AND teacher.patronymic=? AND class.name=? 
                    AND typeSubject.briefly=? AND week.name=? and addPair.id=?`;
            var teacherName = okExcel1[i].teacher.split(' ');

            transaction.all(str, okExcel1[i].group, okExcel1[i].time, okExcel1[i].day, okExcel1[i].subject, teacherName[0], teacherName[1], teacherName[2], okExcel1[i].classRoom, okExcel1[i].typeSubject, okExcel1[i].week, okExcel1[i].additionalPair, (err, rows) => {
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

    });*/
}


function readSchedules(pathFile){
    let workbook = XLSX.readFile(pathFile);
    let sheet_name_list = workbook.SheetNames;
    //console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])); //1 лист вывести
    let numberList = [];
    let merges = [];
    for (let i = 0;i<4; i++){
        numberList.push(workbook.Sheets[sheet_name_list[i]]);  //номер листа
        merges[i] = numberList[i]['!merges'];
    }

    function Search(cel, n){
        for (var i = 0; i < merges[n].length; i++)
            if (merges[n][i].s.c== cel.s.c && merges[n][i].s.r== cel.s.r && merges[n][i].e.c== cel.e.c && merges[n][i].e.r>= cel.e.r)
                return true;
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
        validateGroup.push(listOne[cellName].v);

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
        console.log(kurs1);

        const offsetY1 = 6;  //отступы до названия времени
        const offsetX1 = 1;
        const offsetTime = 4;  //отступ от времени до времени
        const offsetLecture = 2;    //отступ до следующей ячейки
        let cellTime = {c: begin.c + offsetX1, r: begin.r + offsetY1};  //значение 1 6
        let pointer = {c: cellTime.c + 1, r: cellTime.r};   //по этой ячейке проверяем наличие пары
        for(let j = 0; j<kurs1.length; j++){
            let day = 1;
            let group = kurs1[j];
            for(number = 0; listOne[XLSX.utils.encode_cell(cellTime)]!=undefined; day++){
                if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("08.30") >= 0){
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                        Schedules(day, listOne, cellTime, pointer, group, 1);
                        Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                    }
                    if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v==""))   // на верхней неделе пары есть, на нижней - нет

                        Schedules(day, listOne, cellTime, pointer, group, 1);
                    if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v==""))   // на нижней неделе пары есть, на верхней - нет
                        Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                    if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)) // нет разделения на нижнюю и верхнюю неделю
                        Schedules(day, listOne, cellTime, pointer, group, 0);
                    cellTime.r += offsetTime;
                    pointer.r += offsetTime;
                }

                if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                    if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("10.10") >= 0){
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        }
                        if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v==""))   // на верхней неделе пары есть, на нижней - нет
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                        if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v==""))   // на нижней неделе пары есть, на верхней - нет
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)) // нет разделения на нижнюю и верхнюю неделю
                            Schedules(day, listOne, cellTime, pointer, group, 0);
                        cellTime.r += offsetTime;
                        pointer.r += offsetTime;
                    }

                if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                    if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("11.50") >= 0){
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        }
                        if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v==""))   // на верхней неделе пары есть, на нижней - нет
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                        if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v==""))   // на нижней неделе пары есть, на верхней - нет
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)) // нет разделения на нижнюю и верхнюю неделю
                            Schedules(day, listOne, cellTime, pointer, group, 0);
                        cellTime.r += offsetTime;
                        pointer.r += offsetTime;
                    }

                if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                    if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("13.50") >= 0){
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        }
                        if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v==""))   // на верхней неделе пары есть, на нижней - нет
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                        if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v==""))  // на нижней неделе пары есть, на верхней - нет
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)) // нет разделения на нижнюю и верхнюю неделю
                            Schedules(day, listOne, cellTime, pointer, group, 0);
                        cellTime.r += offsetTime;
                        pointer.r += offsetTime;
                    }

                if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                    if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("15.30") >= 0){
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        }
                        if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v==""))   // на верхней неделе пары есть, на нижней - нет
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                        if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v==""))   // на нижней неделе пары есть, на верхней - нет
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)) // нет разделения на нижнюю и верхнюю неделю
                            Schedules(day, listOne, cellTime, pointer, group, 0);
                        cellTime.r += offsetTime;
                        pointer.r += offsetTime;
                    }

                if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
                    if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("17.10") >= 0){
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!=""){  // на верхней и нижней недели пары разные
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        }
                        if(listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && !Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && (listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]==undefined || listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v==""))  // на верхней неделе пары есть, на нижней - нет
                            Schedules(day, listOne, cellTime, pointer, group, 1);
                        if(!Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k) && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})]!=undefined && listOne[XLSX.utils.encode_cell({c: pointer.c, r: pointer.r + offsetLecture})].v!="" && (listOne[XLSX.utils.encode_cell(pointer)]==undefined || listOne[XLSX.utils.encode_cell(pointer)].v==""))   // на нижней неделе пары есть, на верхней - нет
                            Schedules(day, listOne, cellTime, {c: pointer.c, r: pointer.r + 2}, group, 2);
                        if (listOne[XLSX.utils.encode_cell(pointer)]!=undefined && listOne[XLSX.utils.encode_cell(pointer)].v!="" && Search({s: { c: pointer.c, r: pointer.r }, e: { c: pointer.c, r: pointer.r + offsetLecture}}, k)) // нет разделения на нижнюю и верхнюю неделю
                            Schedules(day, listOne, cellTime, pointer, group, 0);
                        cellTime.r += offsetTime;
                        pointer.r += offsetTime;
                    }
            }
            cellTime = {c: begin.c + offsetX1, r: begin.r + offsetY1};
            pointer = {c: pointer.c + offsetGroup, r: cellTime.r};
        }
    }
    validateAndAdd();
    //console.log(validateGroup)
}
module.exports.readSchedules = readSchedules;
