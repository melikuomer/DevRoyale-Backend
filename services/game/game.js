
const { v1 } = require('uuid');
const EventEmitter = require('events');
const {createClient} = require('redis');

const client = createClient();


client.on('error', (err)=>console.log('Redis client Error:: ',err));


async function Init(){
    await client.connect();
    await client.flushAll();
}


function GetQuestion(){
    let Question = {
        QuestionID: "123124",//redis
        Text:" bunlari yap",
        RequiredTime: 15, //redis
        TestCases: [], //redis
        ExpectedResult: [], //redis
    }
    return Question;
}
const GameInstance = {
    GameId: '12313',
    Question: {
        QuestionID: '',
        CompetitionTime: '',
        TestCases: '',
        ExpectedResult: ''
    },
    Players: [{id:'',score: []},]
}

function Submit(user, gameId, code){
    const players = client.hGet(gameId).Players;
    const player = players.filter(x => x !==user.id);
    if(player.length<1) res.status(403).send();
}
async function CreateGame(players){
    
    const gameId = v1(); //Timestamp based uuid;    
    const question=  client.hSet(gameId, 'Question',JSON.stringify(GetQuestion()));
    const playersHash =  client.hSet(gameId, 'Players', JSON.stringify(players));

    await Promise.all([question, playersHash]);
    return gameId;
}

async function EndGame(gameId){
    const matchresults = await client.hGetAll(gameId); //get latest match stats
    await client.del(gameId); //delete game from ram
    return matchresults;
}

const player ={ id:3131, name:'Hasan'};


Init().then(()=>{
    CreateGame([player, player]).then(value =>console.log(value));
})


class Game{


    constructor(players){
        this.ID = v1();
        this.requiredTime = 15;
        this.players = players;
        this.playerMap = new Map();


        this.GameState = new EventEmitter();
        
    }


    Start = function (){
        const minutesToMilliseconds = 1000*60;
        this.GameState.emit('GameStarted');
        setInterval(()=>{
            
            this.GameState.emit('GameEnded',{GameId: this.ID,  } );

        }, this.requiredTime*minutesToMilliseconds)
    }

    CalculateWinners = function (){
        
    }
    
    onCodeSubmit = function (){

    }

}

