const { v1 } = require('uuid');
const {createClient} = require('redis');

const redisConfig = require('../../config.json').redis;
const client = createClient({url: redisConfig.url});
client.connect();

console.log(redisConfig.url);
client.on('error', (err)=>console.log('Redis client Error:: ',err));

client.on('connect', () => console.log('Connection to redis: SUCCEED '));






module.exports.createUserConnection = function CreateUserConnection(userId, socketId){
    client.set(userId.toString(), socketId.toString());
}

module.exports.getUserConnection= function GetUserConnection(userId){
    return client.get(userId.toString());
}

module.exports.destroyUserConnection =  function DestroyUserConnection(userId){
    client.del(userId);
}


module.exports.createGame = async function CreateGame(players, question){

    const pGameId = v1(); //Timestamp based uuid;    
    const pQuestion=  client.hSet(pGameId, 'Question',JSON.stringify(question));
    const pPlayersHash =  client.hSet(pGameId, 'Players', JSON.stringify(players));
    

    await Promise.all([pQuestion, pPlayersHash]);
    return pGameId;
}

module.exports.removePlayerFromGame = async function RemovePlayerFromGame(gameId,playerId){
    let pPlayersHash = await client.hGet(gameId, 'Players');
    pPlayersHash = pPlayersHash.filter(x=>x==playerId);
    await client.hSet(gameId,'Players', pPlayersHash);
    
}

module.exports.getPlayersByGameId = async function GetPlayersByGameId(gameId){
    let players = await client.hGet(gameId, 'Players');
    players = JSON.parse(players)

    return players;
}

module.exports.getPlayer = function getPlayer(gameId , playerId, callback){
    //let players;
    client.hGet(gameId, 'Players').then(players=>{
        let temp = JSON.parse(players)

        console.log("getPlayer players",temp);
        console.log(playerId)
    
        temp.forEach(player => {
            if (player.id === playerId) callback(player);
        });
    })



}

module.exports.GetOtherPlayer =  function GetOtherPlayer(gameId , playerId, callback ){
    client.hGet(gameId, 'Players').then(players=>{
        console.error('error', gameId,  playerId, players);
        let temp= JSON.parse(players);
        callback(temp.find(x => x.id !== playerId));
    })
   




}

module.exports.setPlayer = async function setPlayer(gameId , user){
    let players = await client.hGet(gameId, 'Players');
    players = JSON.parse(players);

    let result = [];
    let temp =players.find(x => x.id != user.id);
    result.push(temp);
    result.push(user);
    console.log(players);
    await client.hSet(gameId, 'Players', JSON.stringify(result));


}



module.exports.isUserInTheGame = async function IsUserInGame(userId, gameId){
    console.log(gameId);
    let players = await client.hGet(gameId, 'Players');
    players = JSON.parse(players);
    
    if(!players) return false;

    return !!players.find(x => x.id === userId);
}



module.exports.getQuestionByGameId = function GetQuestionByGameId(gameId){
    console.log('GameId', gameId);
    return client.hGet(gameId, 'Question');
}

module.exports.destroyGame = function DestroyGame(gameId){
    client.del(gameId);
    console.log("oyun sonlandı ", gameId);
}