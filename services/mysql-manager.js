const mysql = require('mysql')

const database = require("../config.json").database;


const connection = mysql.createConnection({
    host : database.ip,
    user : database.username,
    password: database.password,
    database: database.database_name

});

connection.connect(function (err) {
    if (err) throw err;

    console.log('MySQL bağlantısı başarıyla gerçekleştirildi.');

})


