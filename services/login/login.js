const express = require('express');
const router = express.Router({});
const queries = require('./../mysql-manager')

module.exports = router;



let user_id = 10002;

let user = queries.getUser(user_id,(error, users) => {
    if (error) throw error;
    console.log(users)
    return users;
  });
