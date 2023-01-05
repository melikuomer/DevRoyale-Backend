const express = require('express');
const router = express.Router({});
const sse = require('express-sse');
const { uuid } = require('uuidv4');
const matchmaking  = require('../services/game/matchmaking.js');


module.exports = router;

let connections = [];
// Todo using sse create a matchmaking server
// Todo Modify queue to have 'response' endpoints as well as userId
// todo use express-sse


router.get('/events', (req, res) => {
    console.log('Client connected');
    const ssee = new sse();
    ssee.init();
    // store a reference to the client's connection
    const connectionId = uuid();


    // send a welcome event to the client
    ssee.send({message: 'Welcome!'} ,'welcome', connectionId);
    //sse.close is required to see output on postman
    //sse.close();

});



router.post('/send-event', (req, res) => {
    // get the connection ID and event data from the request body
    const { connectionId, event, data } = req.body;

    // send the event to the client
    sse().send(data, event, connectionId);
});



matchmaking.Event.on('MatchFound', (value)=>{
    console.log("Match Made"+ "Player IDs: "+ value[0].id + " & " + value[1].id);
})