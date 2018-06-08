var sqlite3 = require('sqlite3').verbose();
 
var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
  console.log('Connected to the database.');
});


/*db.run(`CREATE TABLE subject ( 
         id integer PRIMARY KEY, 
         name text NOT NULL
        );`, (err, res) => {
  if (err) {
    throw err;
  }
  db.run(`INSERT INTO subject(name) VALUES ('Алгебра'), ('Геометрия');`);
});*/

/*db.run(`CREATE TABLE rankTeachers (
         id integer PRIMARY KEY,
         name text NOT NULL 
        );`, (err, res) => {
    if (err) {
        throw err;
    }
});*/

db.run(`CREATE TABLE teacher (
         id integer PRIMARY KEY, 
         lastname text NOT NULL,
         firstname text NOT NULL,
         patronymic text NOT NULL,
         rank text REFERENCES rankTeachers(name)
         
        );`, (err, res) => {
  if (err) {
    throw err;
  }
});

/*db.run(`CREATE TABLE class ( 
         id integer PRIMARY KEY, 
         name text NOT NULL
        );`, (err, res) => {
  if (err) {
    throw err;
  }
});

db.run(`CREATE TABLE group1 ( 
         id integer PRIMARY KEY, 
         name text NOT NULL,
         course text NOT NULL
        );`, (err, res) => {
  if (err) {
    throw err;
  }
});*/
/*db.run(`UPDATE subject SET name='Data Mining' WHERE id=3;`);*/

/*
db.run(`CREATE TABLE days ( 
         id integer PRIMARY KEY, 
         name text NOT NULL
        );`, (err, res) => {
  if (err) {
    throw err;
  }
});*/
/*
db.run(`CREATE TABLE users ( 
         id integer PRIMARY KEY, 
         username text NOT NULL, 
         password text NOT NULL, 
         firstname text NOT NULL, 
         lastname text NOT NULL, 
         patronymic text NOT NULL, 
         type_user text NOT NULL,
         email text NOT NULL,
         studyGroups text,
         FOREIGN KEY(type_user REFERENCES type_user(name),
         FOREIGN KEY(studyGroups REFERENCES studyGroups(name))

        );`, (err, res) => {
    if (err) {
        throw err;
    }
});

db.run(`CREATE TABLE type_user ( 
         id integer PRIMARY KEY, 
         name text NOT NULL
        );`, (err, res) => {
    if (err) {
        throw err;
    }
});*/

/*db.run(`CREATE TABLE main_schedule (
         id integer PRIMARY KEY, 
         group_id INTEGER REFERENCES studyGroups(id),
         time_id INTEGER REFERENCES time(id),
         weekday_id INTEGER REFERENCES weekdays(id),
         week text,
         subject_id REFERENCES subject(id),
         teacher_id REFERENCES teacher(id),
         classroom_id REFERENCES class(id),
         period text
        );`, (err, res) => {
    if (err) {
        throw err;
    }
});

db.run(`CREATE TABLE weekdays ( 
         id integer PRIMARY KEY, 
         day text NOT NULL
        );`, (err, res) => {
    if (err) {
        throw err;
    }
});*/

/*db.run(`INSERT INTO weekdays(day) VALUES ('Понедельник'), ('Вторник'),('Среда'),('Четверг'),('Пятница'),('Суббота'),('Воскресенье');`);


db.run(`CREATE TABLE studyGroups ( 
         id integer PRIMARY KEY, 
         day name NOT NULL
        );`, (err, res) => {
    if (err) {
        throw err;
    }
});

db.run(`CREATE TABLE time ( 
         id integer PRIMARY KEY AUTOINCREMENT, 
         time name NOT NULL
        );`, (err, res) => {
    if (err) {
        throw err;
    }
});*/

db.close();