const express = require('express');
const router = express.Router({});

module.exports = router;

router.post('/',addQuestion)

const format = {
    question: 'ŞU DURUMLARDA ŞÖYLE OLSUN BÖYLE YAPIN AMK',
    competitionTime: '15',
    testCases: '1,2,3,4/5,6,7,8/9,10,11,12',
    expectedOutput: '3,5,1'
  }

function addQuestion(req, res){
    let values = req.body.testCases.split('\r\n');
    let testCases = [];
    values.forEach(element => {
        testCases.push(element.split(','))
    });

    let expectedOutput = req.body.expectedOutput.split(',');

    let question = {
        question: req.body.question,
        competitionTime: req.body.competitionTime,
        testCases: testCases,
        expectedOutput: expectedOutput
    }
    console.log(question);
}











const queries = require("../services/mysql-manager.js");




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
