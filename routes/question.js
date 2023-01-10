const express = require('express');
const router = express.Router({});
const queries = require("../services/mysql-manager.js");

module.exports = router;


// dont need jwt aut
function getQuestion(req,response) {
    const question_id = req.body.question_id; 
    queries.getQuestion(question_id, (error, resp) => {
        if (error) return response.status(404).send(error.toString());
        return response.json(resp);
    });
}   

function createQuestion(req,response ) {
    const question = req.body
    queries.createQuestion( JSON.stringify(question) ,(error,resp) => {
        if (error) return response.status(404).send(error.toString());
        return response.json(resp)
    })    
}

router.post('/', getQuestion);


router.post('/create',createQuestion)