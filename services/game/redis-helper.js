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

module.exports.getPlayersByGameId = function GetPlayersByGameId(gameId){
    return client.hGet(gameId, 'Players');
}

module.exports.getPlayer = function GetPlayersByGameId(gameId , playerId){
    let players = JSON.parse(client.hGet(gameId, 'Players'));

    players.forEach(player => {
        if (player.playerId === playerId) return player;
    });


}

module.exports.GetOtherPlayer = function GetPlayersByGameId(gameId , playerId){
    let players = JSON.parse(client.hGet(gameId, 'Players'));

    players.forEach(player => {
        if (player.playerId !== playerId) return player;
    });


}

module.exports.setPlayer = function GetPlayersByGameId(gameId , user){
    let players = JSON.parse(client.hGet(gameId, 'Players'));

    players.forEach(player => {
        if (player.playerId === user.playerId) {
            player = user;
            client.hSet(gameId, 'Players', JSON.stringify(players));
        }
    });


}



module.exports.isUserInTheGame = async function IsUserInGame(userId, gameId){
    console.log(gameId);
    let players = await client.hGet(gameId, 'Players');
    players = JSON.parse(players);
    
    return players.find(x=>x.id===userId)?true:false;
}



module.exports.getQuestionByGameId = function GetQuestionByGameId(gameId){
    console.log('GameId', gameId);
    return client.hGet(gameId, 'Question');
}

module.exports.destroyGame = function DestroyGame(gameId){
    client.del(gameId);
}