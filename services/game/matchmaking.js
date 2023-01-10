const queueConfig = require('../../config.json').queue; 
const  events = require('events');

const EMPTY_SLOT = {"id":0, "tempElo":0};


class Queue {
    constructor(config){
        this.Event = new events.EventEmitter();
        this.pocketSize = config.pocketsize;         
        this.queueList = new Array(this.pocketSize).fill( EMPTY_SLOT);
   
    }

    Init  = function (){

    }

    AddPlayer = function (players){ 

        const player = players[0];
        let rootIndex = this.EloToIndex(player.tempElo);
        let currentIndex;
        if(!players[1]){
            currentIndex = rootIndex;
        }else currentIndex =players[1]

        if(currentIndex>=this.queueList.length)return;

        switch (this.queueList[currentIndex].id) {
            case 0:
                this.queueList[currentIndex]= player;
                break;
    
            case player.id:
                if(currentIndex>rootIndex)                    
                    this.AddPlayer([player, currentIndex+1]);
                if(currentIndex<rootIndex)
                    this.AddPlayer([player, currentIndex-1]);
                if(currentIndex ===rootIndex)
                {                    
                    this.AddPlayer([player, currentIndex+1]);        
                    this.AddPlayer([player, currentIndex-1]);
                }
                break;
    
            default:
                console.log("eslesenler : " + String(player.id) + " ve " + String(this.queueList[currentIndex].id));
                this.MatchFound([player,this.queueList[currentIndex]]);
                break;
        }
    }
    
    MatchFound= function(players){
        this.ResetPocket(this.EloToIndex(players[0].tempElo));        
        this.CheckAdjacentRecursive(this.EloToIndex(players[0].tempElo), players[0].id,(index) =>{    
            this.ResetPocket(index);            
        });
        this.ResetPocket(this.EloToIndex(players[1].tempElo));        
        this.CheckAdjacentRecursive(this.EloToIndex(players[1].tempElo), players[1].id,(index) =>{    
            this.ResetPocket(index);            
        });
       
        this.Event.emit('MatchFound', players);
    }

    ResetPocket = function (index){
        this.queueList[index] = EMPTY_SLOT;
    }

    CheckAdjacentRecursive = function (index, value , callback){
        console.log(value)
        if(index>this.queueList.length||index<0) return;
        
        if(this.queueList[index+1].id===value) {
            callback(index+1);
            this.CheckAdjacentRecursive(index+1,value, callback);

        }

        if(this.queueList[index-1].id===value) {
            callback(index-1);
            this.CheckAdjacentRecursive(index-1, value, callback);

        }

        
    }

    EloToIndex = function (elo){
        return parseInt(elo / this.pocketSize);
    }

}

let queue  = new Queue(queueConfig);
queue.Init();


//Test();

//queue test
function Test(){
    setTimeout(()=>{
        let player = {"id": 231124, "tempElo": 1200};
        let secondPlayer = {"id": 256124, "tempElo": 900};
        queue.AddPlayer([player]);
        queue.AddPlayer([secondPlayer])
        queue.AddPlayer([player]);
        queue.AddPlayer([player]);
        console.log(queue.queueList)
        queue.AddPlayer([player]);
        setTimeout(()=>{
            console.log(queue.queueList);
        }, 1000*2);
    }, 1000*1)
}



module.exports = queue;





