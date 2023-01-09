
const { v1 } = require('uuid');
const EventEmitter = require('events');

const CodeTester = 


class GameManager{

    constructor(question, players){
        this.questionString = question.string;
        this.requiredTime = question.requiredTime;
        
    }



    CreateGame = function (players, question){
        //create and return new game instance
    }


}



class Game{


    constructor(players){
        this.ID = v1();
        this.requiredTime = 15;
        this.players = players;
        this.playerMap = new Map();
        this.playerMap.set("Ahmet", 213123);

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



let game = new Game();

console.log(game.playerMap.get('Ahmet'));