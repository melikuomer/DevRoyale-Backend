const express = require('express');
const router = express.Router({});
const bcrypt = require('bcrypt')
const queries = require("../services/mysql-manager.js");

module.exports = router;


// dont need jwt aut
async function registerUser(req,response) {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt);
        console.log(hashedPassword);
        let newUser = {
            firstName: req.body.firstName,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
        };
        console.log(newUser);
          queries.createUser(newUser, (error, user_id) => {
            // TODO make error handling better 
            if (error) return response.status(404).send(error.toString());
            queries.createStats(user_id,(error,result) => {
            if (error) return response.status(404).send(error.toString());
            });

            return response.json(JSON.stringify(user_id));});
    } catch (error) {
        response.status(500).send()
    }
}

router.post('/', registerUser);