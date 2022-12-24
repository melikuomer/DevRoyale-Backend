
const express = require('express');
const router = express.Router({});
let jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = router;


router.post('/',login)


function login(req, res){


    let user = {
        email: req.body.email,
        password: req.body.password,
    }
    //user = JSON.parse(req.body);
    console.log(req.body)
    jwt.sign(user,config.randomBytes,{   expiresIn: '24h'},(err , value)=>{
        if (err) return err;
        res.json(value);
    });
}



