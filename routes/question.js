const express = require('express');
const router = express.Router({});
const queries = require("../services/mysql-manager.js");

module.exports = router;


router.get('/', getQuestion);

router.post('/',createQuestion)

const exampleQuestionFormat = {
    "TestCases": [
        [ 1, 3, 3, 3, 4, 6 ],
        [ 2, 5, 7, 4, 7 ],
        [ 1, 2, 0, -1, -3]
    ],
    "QuestionText": "Find average of an list.",
    "ExpectedResults": [ 3, 5, -0.2 ],
    "RequiredTimebyMinute": 5
}

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
