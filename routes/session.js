
const express = require('express');
const router = express.Router({});
let jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = router;


router.post('/',login)


function login(req, res){

    let user = {
        name: "Ahmet",
        lastname: "Veren",
    }
    jwt.sign(user,config.randomBytes,{   expiresIn: '24h'},(err , value)=>{
        if (err) return err;
        res.json(value);
    });
}


