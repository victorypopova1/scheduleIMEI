var sqlite3 = require('sqlite3').verbose();
 
var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
  console.log('Connected to the database.');
});

db.each('SELECT * FROM teacher', (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.id} ${row.lastname} ${row.firstname} ${row.pytronymic}`);
});

db.each('SELECT * FROM subject', (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.id} ${row.name}`);
});

db.each('SELECT * FROM class', (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.id} ${row.name}`);
});

db.each('SELECT * FROM group1', (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.id} ${row.name}`);
});
db.each('SELECT * FROM days', (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.id} ${row.name}`);
});