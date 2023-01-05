

let id = [1,24,53,21,74,67,16,26]//users
let playerlist = []
let queue = [];

for(let i = 0;i<30;i++){//fill queue with 0s because we need to ensure that at start queue will be empty
    queue[i] = 0;
}


class player {
    constructor(count){

        this.nick = "player " + String(id[count])
        this.id = id[count]
        this.elo = Number(2880 + Math.floor(Math.random() * 20));
        this.MatchCount = 1;
        this.WinCount = 1;
        this.LoseCount = 1;
        this.winrate = this.WinCount/ this.MatchCount;
        this.tempElo = this.elo * this.winrate;
        this.ingame = false;
        this.index = parseInt(this.tempElo/100)
        this.p2 = this.tempElo - this.index*100;

    }
}

// 1968 => queue[19][68] != 0 => foundgame
function foundGame(playerid, player2id) {
   console.log(String(playerid) + " " + String(player2id) + " eslesti");
}

function normalSearch(_player){
    if(ingameplayers[_player.id] === 1){return;}

    index = parseInt(_player.elo / 100);
    p2 = _player.elo - index*100;
    if(queue[index][p2] === 0){
        queue[index][p2] = _player.id;
        return 0;
    }
    else if(queue[index][p2] !== 0 && queue[index][p2] !== _player.id ){
        foundGame(_player.id,queue[index][p2]);
        ingameplayers[queue[index][p2]] = 1;
        playerlist[queue[index][p2]].ingame = true;
        ingameplayers[_player.id] = 1;
        _player.ingame = true;
        queue[index][p2] = 0;
        return queue[index][p2];
    }
}

function AddtoQueue(_player,tempElo){
    let pocketSize = 100;
    let index = parseInt(_player.tempElo / 100);

    if(index>=queue.length)return;

    switch (queue[index]) {
        case 0:
            queue[index]= _player.id;
            break;

        case _player.id:
            if(tempElo>_player.tempElo)
                AddtoQueue(_player, tempElo+pocketSize);
            if(tempElo<_player.tempElo)
                AddtoQueue(_player, tempElo-pocketSize);
            if(tempElo !==_player.tempElo)
            {
            AddtoQueue(_player, tempElo - pocketSize);
            AddtoQueue(_player, tempElo + pocketSize);
            }
            break;

        default:
            console.log("eslesenler : " + String(_player.id) + " ve " + String(queue[index]));
            foundGame(_player.id,queue[index])
            return;
            break;
    }
}

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





