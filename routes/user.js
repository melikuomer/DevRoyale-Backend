const express = require('express');
const router = express.Router({});
const bcrypt = require('bcrypt');
const queries = require('../services/mysql-manager.js')

module.exports = router;

// we need use async with await or promises to querries work 

function RegisterUser(req,response) {
    console.log("RegisterUser Route");

    let newUser = {
        firstName: req.body.firstName,
        lastname: req.body.lastname,
        email:  req.body.email,
        password: req.body.password,              //TODO: add passwd security 
        // description: "hoşgeldiniz",
    };
    console.log(newUser);
    /*
    // for only test 
    
    let newUser = {
        firstName: "yetkin",
        lastname: "tunay",
        email:  "yetun123@gmail.com",
        password: "123124213",              //TODO: add passwd security 
        // description: "hoşgeldiniz",
    };
    */

    // we need to await queries to work
    queries.createUser(newUser, (error, response) => {
        if (error) throw error;
        console.log(response)
        return response;
    });
    console.log(" after create -> ")
    response.json("status code 400")
}

function getUser(req,response) {
    console.log("getUser");
    response.json("status code 400");
}   

function updateUser(req,response) {
    console.log("updateUser");
    console.log(req.body)
    
    
    
    
    response.json("status code 400");
}


router.post('/',RegisterUser);
// TODO: register new user while encrypting and salting the password with 'bcrypt'
// TODO: if user with same email exists return error
// TODO: verify user input
// TODO: generate random bytes on config file for encrypting purposes

router.get('/',getUser);
// get user with parameter
// check jwt with user parameter optional
// then 


router.put('/',updateUser);
