const express = require('express');
const router = express.Router({});
const {sseMiddleware} = require('express-sse-middleware');
const { uuid } = require('uuidv4');

module.exports = router;


let connections = [];
// Todo using sse create a matchmaking server
// Todo Modify queue to have 'response' endpoints as well as userId


router.get('/events', (req, res) => {
    console.log('Client connected');

    const sse = res.sse();
    // store a reference to the client's connection
    const connectionId = uuid();
    connections.push(sse);

    // send a welcome event to the client
    sse.send(JSON.stringify({ message: 'Welcome!' , id:connectionId}));
    //sse.close is required to see output on postman
    //sse.close();

});

setInterval(()=>{
connections.forEach(connection => connection.send(JSON.stringify({message: 'sa'})))

},1000)

router.post('/send-event', (req, res) => {
    // get the connection ID and event data from the request body
    const { connectionId, event, data } = req.body;

    // send the event to the client
    sseMiddleware().send(data, event, connectionId);
});
