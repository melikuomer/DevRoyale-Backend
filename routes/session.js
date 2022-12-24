
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
        let Dbuser =
        {
            email: "",
            password: "",
        };

        console.log(user);

    let sqlQuery = `SELECT email , password FROM devroyale.users WHERE
        email = "${user.email}" AND
        password = "${user.password}";`

    console.log(sqlQuery);

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(sqlQuery, function (err, res ) {
            if (err) throw err;
            console.log("res" , res);
            if (res){
            console.log("res.email = ", res[0].email);
            Dbuser.email = res[0].email;
            Dbuser.password = res[0].password;}
            console.log("after edit =",Dbuser);
        });
    });

    console.log("Dbuser",Dbuser);    
    if (Dbuser.email == user.email && Dbuser.password == user.password )
    {
      console.log("test");
        jwt.sign(user,config.randomBytes,{   expiresIn: '24h'},(err , value)=>{
            if (err) return err;
            response.json(value);
        });
    }
    response.json()
    //user = JSON.parse(req.body);
   // console.log(req.body)
}



