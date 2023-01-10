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











