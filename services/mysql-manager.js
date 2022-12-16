
const mysql = require('mysql2');

const database = require("../config.json").database;



const connection = mysql.createConnection({
    host : database.ip,
    user : database.username,
    password: database.password,
    database: database.database_name
});


module.exports.query = connection.query("select user()",(err,result)=>{
    console.log(result);
});

