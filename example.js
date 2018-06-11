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
var validateTeacher=[];
var validateRank=[];
var validateClass=[];
okExcel=[];

function Schedules(p, day, listOne, cellTime){   //получаем объект, номер дня, номер листа, время

    p.day = day;
    console.log(p.day);

    p.time = listOne[XLSX.utils.encode_cell(cellTime)].v;
    console.log(p.time);

    cellSubject = {c: cellTime.c + 1, r: cellTime.r};
    p.subject = listOne[XLSX.utils.encode_cell(cellSubject)].v;
    console.log(p.subject);

    cellTeacher = {c: cellTime.c + 2, r: cellTime.r};
    p.teacher = listOne[XLSX.utils.encode_cell(cellTeacher)].v;
    console.log(p.teacher);

    cellClass = {c: cellTime.c + 3, r: cellTime.r};
    p.class = listOne[XLSX.utils.encode_cell(cellClass)].v;
    console.log(p.class);

    var s = p.subject;
    var res = s.split('.').pop();//убираем тип предмета
    var subj=res.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
    validateSubject.push(subj);
    validateSubject = Unique(validateSubject);//убираем повторяющиеся записи

    var t=p.teacher;
    var teach=t.split(',')[0];
    var rank=t.split(',')[1];

    teach=teach.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы

    rank=rank.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
    validateRank.push(rank);
    validateRank=Unique(validateRank);//убираем повторяющиеся записи



    var teacherAndRank = p.teacher.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем лишние пробелы
    //replace(/[/.,!?;]*/g, '').replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');//убираем запятые
    validateTeacher.push(teacherAndRank);
    validateTeacher = Unique(validateTeacher);//убираем повторяющиеся записи

    //console.log(validateTeacher);

    okExcel.push({day: p.day, time: p.time, subject: subj, teacher: teach, class: p.class});
    console.log(okExcel);
}



function validateS(){   //проверем наличие данных в бд

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
                    db.all(`INSERT INTO subject(name) VALUES ('${validateSubject[i]}');`,
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
    var resTeach='';
    db.beginTransaction(function(err, transaction) {
        for (var i = 0; i < validateTeacher.length; i++) {
            var t1=validateTeacher[i].split(',')[0];
            var r1=validateTeacher[i].split(',')[1].replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s{2,}/g, ' ');
            var teacherName = t1.split(' ');
            transaction.all(`SELECT id FROM teacher WHERE lastname='${teacherName[0]}' AND firstname='${teacherName[1]}' AND patronymic='${teacherName[2]}'`, (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resTeach=row.id;
                });
                if (rows.length!==0) {
                    //ar index = validateSubject.indexOf(resSubj);
                    validateTeacher.splice(validateTeacher[i], 1);
                    // console.log(validateSubject);
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
                    db.all(`INSERT INTO teacher(lastname, firstname, patronymic,rank) VALUES ('${teacherName[0]}', '${teacherName[1]}', '${teacherName[2]}', '${r1}');`,
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
            transaction.all(`SELECT id FROM rankTeachers WHERE name=?`,validateRank[i], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    resRank=row.id;
                });
                if (rows.length!==0) {
                    validateRank.splice(validateRank[i], 1);
                }
            });
        }
        transaction.commit(function (err) {
            if (err) {
                throw err;
            }
            else {
                for (var i = 0; i < validateRank.length; i++) {
                    db.all(`INSERT INTO rankTeachers(name) VALUES ('${validateRank[i]}');`,
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



let XLSX = require("xlsx");
let workbook = XLSX.readFile("./files/example1.xlsx");
let sheet_name_list = workbook.SheetNames;
//console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])); //1 лист вывести

const offsetY = 5;  //отступы до названия 1 группы
const offsetX = 2;
let listOne = workbook.Sheets[sheet_name_list[0]];  //1 лист
let begin = {c: 0, r: 0};

let cell = {c: begin.c + offsetX, r: begin.r + offsetY};  //адрес 2 5
//console.log(cell);
let cellName = XLSX.utils.encode_cell(cell);    //значение
//console.log(listOne[cellName].v);
let kurs1 = [];
kurs1.push(listOne[cellName].v);
const offsetGroup = 3;  // отступ от времени до времени
//console.log(listOne[XLSX.utils.encode_cell({c:cellp.c + offsetGroup, r:cell.r})].v);
cell.c += offsetGroup;
cellName = XLSX.utils.encode_cell(cell);
while (listOne[cellName]!=undefined){   //считываем названия групп в массив
    kurs1.push(listOne[cellName].v);
    cell.c += offsetGroup;
    cellName = XLSX.utils.encode_cell(cell);
}
console.log(kurs1);

let p = [];
const offsetY1 = 6;  //отступы до названия времени
const offsetX1 = 1;
const offsetTime = 4;  //отступ от времени до времени
let day = 1;
let cellTime = {c: begin.c + offsetX1, r: begin.r + offsetY1};  //значение 1 6
for(let i = 0; listOne[XLSX.utils.encode_cell(cellTime)]!=undefined; day++){ //

    if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("08.30") >= 0){
        if (listOne[XLSX.utils.encode_cell({c: cellTime.c + 1, r: cellTime.r})].v!=""){
            p[i]={};
            Schedules(p[i], day, listOne, cellTime);
            i++
        }
        cellTime.r += offsetTime;
    }

    if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
        if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("10.10") >= 0){
            if (listOne[XLSX.utils.encode_cell({c: cellTime.c + 1, r: cellTime.r})].v!=""){
                p[i]={};
                Schedules(p[i], day, listOne, cellTime);
                i++
            }
            cellTime.r += offsetTime;
        }

    if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
        if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("11.50") >= 0){
            if (listOne[XLSX.utils.encode_cell({c: cellTime.c + 1, r: cellTime.r})].v!=""){
                p[i]={};
                Schedules(p[i], day, listOne, cellTime);
                i++
            }
            cellTime.r += offsetTime;
        }

    if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
        if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("13.50") >= 0){
            if (listOne[XLSX.utils.encode_cell({c: cellTime.c + 1, r: cellTime.r})].v!=""){
                p[i]={};
                Schedules(p[i], day, listOne, cellTime);
                i++
            }
            cellTime.r += offsetTime;
        }

    if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
        if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("15.30") >= 0){
            if (listOne[XLSX.utils.encode_cell({c: cellTime.c + 1, r: cellTime.r})].v!=""){
                p[i]={};
                Schedules(p[i], day, listOne, cellTime);
                i++
            }
            cellTime.r += offsetTime;
        }

    if(listOne[XLSX.utils.encode_cell(cellTime)]!=undefined)
        if (listOne[XLSX.utils.encode_cell(cellTime)].v.indexOf("17.10") >= 0){
            if (listOne[XLSX.utils.encode_cell({c: cellTime.c + 1, r: cellTime.r})].v!=""){
                p[i]={};
                Schedules(p[i], day, listOne, cellTime);
                i++
            }
            cellTime.r += offsetTime;
        }
}
validateS();

//module.exports.readSchedules = readSchedules;