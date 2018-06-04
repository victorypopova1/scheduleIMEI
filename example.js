var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

function Schedules(p, day, listOne, cellTime){   //получаем объект, номер дня, номер листа, время
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message);
            }
        });
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

    var result='';
    db.all("SELECT * FROM subject WHERE name=?",p.subject, (err, rows) => {
        if (err) {
            throw err;
        }
        //console.log(p.subject);
        /*rows.forEach((row) => {
            result = row.id;
        });*/
        //console.log(result);
        if(rows.length==0) {
            //console.log(p.subject);
            db.all(`INSERT INTO subject(name) VALUES ('${p.subject}')`, (err, rows) => {
                if (err) {
                    throw err;
                }
            });
        };

    });
}


/*var sqlite3 = require ('sqlite3').verbose();
var db = new sqlite3.Database('./db/sample.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
    if (err){
        console.error(err.message);
    }
    console.log('Connected to the chinook database');
});*/

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


//module.exports.readSchedules = readSchedules;