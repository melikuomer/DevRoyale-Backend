let mysql = require('mysql2');
const database = require('../../config.json').database;


const con = mysql.createConnection({
    host : database.ip,
    user : database.username,
    password: database.password,
    database: database.database_name
});


let newUser = {
    firstName: "yetkin",
    lastname: "tunay",
    email:  "yetun123y@gmail.com",
    password: "123124213",              //todo add passwd security 
    description: "hoşgeldiniz",
};

//console.log(newUser);

let sqlQuery = `INSERT INTO devroyale.users(first_name,last_name,email,password,create_time,description)VALUES(
    "${newUser.firstName}" ,
    "${newUser.lastname}",
    "${newUser.email}",
    "${newUser.password}",
    now(),
    "${newUser.description}"
);`


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sqlQuery, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
    });
  });



