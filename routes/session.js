
const express = require('express');
const router = express.Router({});
let jwt = require('jsonwebtoken');
const config = require('../config.json');
let mysql = require('mysql2');


module.exports = router;

const database = require('../config.json').database;


const con = mysql.createConnection({
    host : database.ip,
    user : database.username,
    password: database.password,
    database: database.database_name
});



router.post('/',login)




function login(req, response){
    
    let user = {
        email: req.body.email,
        password: req.body.password,
    }
        console.log(user);

    let sqlQuery = `SELECT * FROM devroyale.users WHERE
        email = "${user.email}" AND
        password = "${user.password}";`

    console.log(sqlQuery);


        console.log("Connected!");
    con.query(sqlQuery, getUser);

    function getUser (err, res ) {
        if (err) {
            response.status(500).send("Unexpected server issue");
            throw err;
        }
        if(res.length ===0) {
            response.status(401).send("Incorrect username or password");
            return;
        }
        console.log("test");
        jwt.sign(user,config.randomBytes,{   expiresIn: '24h'},(err , value)=>{
            if (err) return err;
            response.json(value);
        });
    }
    //user = JSON.parse(req.body);
   // console.log(req.body)
}



