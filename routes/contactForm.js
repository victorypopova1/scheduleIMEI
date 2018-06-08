var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var passport = require('passport');
var app = express();
var path = require('path');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
/*auth part*/
isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/schedule');
    }
};

router.get('/contactForm', function (req, res) {
    res.render('contactForm', { title: "Contact admin"});
});

router.post('/send', (req, res) => {
    var output = `
    <p>Вам пришло новое сообщение</p>
    <h3>Информация</h3>
    <ul>  
      <li>Имя: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Сообщение</h3>
    <p>${req.body.message}</p>
  `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'testschedule@mail.ru', // generated ethereal user
            pass: '123456qwer'  // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <testschedule@mail.ru>', // sender address
        to: 'victorypopova1@gmail.com',// list of receivers
        subject: 'Node Contact Request', // Subject line
        attachments: [
            { // file on disk as an attachment
                path: '/db/db/sample.db' // stream this file
            }
        ],
        text: 'Hello world?', // plain text body
        html: output // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contactForm', {message:'Email has been sent'});
    });
});


module.exports = router;