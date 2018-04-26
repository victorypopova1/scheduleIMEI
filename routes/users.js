var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');

/* GET users listing. */
router.get('/user', function (req, res) {
    var db = new sqlite3.Database('./db/sample.db'),
        sql = 'select * from users',
        users = [],
        i = 0;
    db.each(sql, function (err, row) {
        if (err) {
            throw (err);
        }
        if (row) {
            users[i] = {username: row.username};
            i++;
        }
    }, function () {
        db.close();
        res.render('users', {title: 'Userlist', users: users});
    });


});

module.exports = router;
