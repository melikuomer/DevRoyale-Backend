
const mysql = require('mysql2');

const database = require("../config.json").database;

const connection = mysql.createConnection({
    host : database.ip,
    user : database.username,
    password: database.password,
    database: database.database_name
});


connection.query("select user()",(err,result)=>{
    console.log(result);
})

