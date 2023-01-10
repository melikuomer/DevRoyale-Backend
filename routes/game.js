

const express = require('express');
const router = express.Router({});
const {createClient} = require('redis')

module.exports = router;

router.post('/', )
router.put('/')



function JoinQueue(playerId){
    //call matchhmaking system queue function
}

function PriorityQueue(playerId){
    //call priority queue

}

function on_MatchFound(players){


    //get a question from database
    //create an unique game id and add it to a map
    //send players a packet telling the game has started
}
// implement a current games buffer
//

//TODO: Keep how much time spent for each solution until the submit endpoint receives input