
const queueConfig = require('../../config.json').queue; 
const  events = require('events');

const emptySlot = 0;

class Queue {
    
    
    
    constructor(config){
        this.Event = new events.EventEmitter();
        this.pocketSize = config.pocketSize;         
        this.QueueList = Array(this.pocketSize, emptySlot);
        
        


    }

    Init  = function (){

    }

    Add = function (player){
        
    }
    
    MatchFound= function(players){
        queue.Event.emit("MatchFound", players);
    }

}

let queue  = new Queue(queueConfig);
queue.Init();

module.exports = queue;






