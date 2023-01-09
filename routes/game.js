

const express = require('express');
const router = express.Router({});
const {createClient} = require('redis')

module.exports = router;

router.post('/', )
router.put('/')


const client = createClient();

client.on('error', (err)=>console.log('Redis client Error:: ',err));

client.connect();

client.set('ahmet','3131331').then(()=>{
    client.get('ahmet').then(value=> console.log("Ahmet :=  ",value))
    
})


function JoinQueue(playerId){
    //call matchhmaking system queue function
}

function PriorityQueue(playerId){
    //call priority queue

}

function on_MatchFound(players){
    //create an unique game id and add it to a map
    //send players a packet telling the game has started
}
// implement a current games buffer
//

//TODO: Keep how much time spent for each solution until the submit endpoint receives input