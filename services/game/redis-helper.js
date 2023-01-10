const { v1 } = require('uuid');
const {createClient} = require('redis');
const client = createClient();
client.connect();




module.exports.createUserConnection = function CreateUserConnection(userId, socketId){
    client.set(userId.toString(), socketId.toString());
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
module.exports.getPlayersByGameId = function GetPlayersByGameId(gameId){
    return client.hGet(gameId, 'Players');
}
module.exports.getQuestionByGameId = function GetQuestionByGameId(gameId){
    return client.hGet(gameId, 'Question');
}

module.exports.destroyGame = function DestroyGame(gameId){
    client.del(gameId);
}