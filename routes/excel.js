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
let a = 0;
/*auth part*/


isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/selectGroup');
    }
};

/* GET home page. */

//здесь выводим форму для загрузки
router.get("/downloadExcel",isLoggedIn, function(req, res) {
    res.render("downloadExcel", { title: "Загрузка расписания" });
});

//здесь происходит сама загрузка
router.post("/downloadExcel", function(req, res, next) {
    // создаем форму
    var form = new multiparty.Form();
    //здесь будет храниться путь с загружаемому файлу, его тип и размер
    var uploadFile = { uploadPath: "", type: "", size: 0 };
    //максимальный размер файла
    var maxSize = 2 * 1024 * 1024; //2MB
    //поддерживаемые типы(в данном случае это картинки формата jpeg,jpg и png)
    var supportMimeTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
    ];
    //массив с ошибками произошедшими в ходе загрузки файла
    var errors = [];

    //если произошла ошибка
    form.on("error", function(err) {
        if (fs.existsSync(uploadFile.path)) {
            //если загружаемый файл существует удаляем его
            fs.unlinkSync(uploadFile.path);
            console.log("error");
        }
    });

    form.on("close", function() {
        //если нет ошибок и все хорошо
        if (errors.length == 0) {
            //сообщаем что все хорошо
            //res.send({ status: "ok", text: "Success" });
            //читаем данные из файла
            if (a == 0){
                var randomName = require("./example.js");
                randomName.readSchedules(uploadFile.path);
                a = 1;
                res.redirect("/downloadExcel");
            }
            else{
                var randomName = require("./example.js");
                randomName.readSchedules(uploadFile.path);
                a = 0;
                res.redirect("/selectGroup");
            }
        } else {
            if (fs.existsSync(uploadFile.path)) {
                //если загружаемый файл существует удаляем его
                fs.unlinkSync(uploadFile.path);
            }
            //сообщаем что все плохо и какие произошли ошибки
            res.send({ status: "bad", errors: errors });
        }
    });

    // при поступление файла
    form.on("part", function(part) {
        //читаем его размер в байтах
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers["content-type"];
        //путь для сохранения файла
        uploadFile.path = "./files/" + part.filename;

        //проверяем размер файла, он не должен быть больше максимального размера
        if (uploadFile.size > maxSize) {
            errors.push(
                "Размер файла " +
                uploadFile.size +
                ". Максимально допустимый размер" +
                maxSize / 1024 / 1024 +
                "MB."
            );
        }

        //проверяем является ли тип поддерживаемым
        if (supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push("Недопустимый тип " + uploadFile.type);
        }

        //если нет ошибок то создаем поток для записи файла
        if (errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        } else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    });

    // парсим форму
    form.parse(req);
});


module.exports = router;