const redis = require('./redis-helper.js');
const elo = require('./elo.js');
const mysql = require('../mysql-manager.js');


exports.EndGame =function (gameId){
    //redise gir
    let players = JSON.parse(redis.getPlayersByGameId());


    //sonuçları kıyasla
    players.forEach(player => {
        player.FinalScore =  player.TimeScore  + player.PerformanceScore + player.CodeBeautyScore;

    });
    let temp;
    let winner;
    let looser;
    players.forEach(player=>{
        if(player.FinalScore > temp) {
            temp = player.FinalScore;
            winner = player.playerId;
        }
    })
    
    //kazananı bul
    if(players[0].playerId == winner) looser = players[1].playerId;
    else looser = players[0].playerId;


    //eloları hesapla
    elo.calculateNewElos(winner, looser);


    
    //eloları güncelle
    mysql.updateElo(winner.playerId, winner.elo);
    mysql.updateElo(looser.playerId, looser.elo);



    //sonuçları paylaş 



    //oyunu redisten kaldır
    redis.destroyGame(gameId);


}

