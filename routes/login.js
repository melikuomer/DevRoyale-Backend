const express = require('express');
const router = express.Router({});
const bcrypt = require('bcrypt')
const queries = require("../services/mysql-manager.js");
const jwt = require('jsonwebtoken')
// for jwt token 
const secret_token = require('./../config.json').randomBytes 


module.exports = router;


async function login (req, response) {
    let user = {
        email: req.body.email,
        password: req.body.password,
    };
    console.log("user",user);
    queries.getUserByEmail(user.email, async (error, result) => {
    if(error) return response.status(404).send("Email or Password Incorrect")
    if(result.length !== 1) return response.status(404).send("cannot find user")
    // result is array so we use 
    try {
            // add jwt token 
            if ( await bcrypt.compare(user.password , result[0].password )){
                //const user_id = {user_id: result[0].user_id};
                console.log("result",result)
                const token = jwt.sign({user_id: result[0].user_id},secret_token,{expiresIn: "12h"})
                return response.json({token: token})
            }
            else {
                return response.status(404).send("wrong password")
            }
        } catch {
            return response.status(401).send("Email or Password Incorrect")
        }
    })
}

router.post('/', login);
