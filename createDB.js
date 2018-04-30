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
});


db.run(`CREATE TABLE teacher ( 
         id integer PRIMARY KEY, 
         lastname text NOT NULL,
         firstname text NOT NULL,
         patronymic text NOT NULL
        );`, (err, res) => {
  if (err) {
    throw err;
  }
});*/

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
         name text NOT NULL
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

db.run(`CREATE TABLE users ( 
         id integer PRIMARY KEY, 
         username text NOT NULL, 
         password text NOT NULL, 
         firstname text NOT NULL, 
         lastname text NOT NULL, 
         patronymic text NOT NULL, 
         type_user text NOT NULL,
         email text NOT NULL,
         FOREIGN KEY(type_user REFERENCES type_user(name)
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
});
/*db.run(`UPDATE days SET name='Понедельник' WHERE id=1;`);*/
db.close();