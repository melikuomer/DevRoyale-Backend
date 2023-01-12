const express = require('express');
const router = express.Router({});
const queries = require('./../services/mysql-manager');

module.exports = router;


function getProfile(req, response) {
    console.log("girdi");

    if (!req.body) {
        response.send("error")
    }
    queries.getProfile(req.user_id, (error, result) => {
        if (error) return response.status(404).send("Cannot get Profile");
        delete result['password'];
        return response.json(result);
    })
}

router.get('/', getProfile)