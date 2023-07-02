const redis = require('./redis-helper.js');
const elo = require('./elo.js');
const mysql = require('../mysql-manager.js');

const exampleResult = [
    {
        "peak_memory": 1747.5555555555557,
        "elapsed_time": 0.12037777777777776,
        "result": "Test Case 0: PASSED"
    },
    {
        "peak_memory": 2250.6666666666665,
        "elapsed_time": 0.19863333333333333,
        "result": "Test Case 1: PASSED"
    },
    {
        "peak_memory": 1504,
        "elapsed_time": 0.09198999999999999,
        "result": "Test Case 2: PASSED"
    }
];

const exampleResult2 = [
    {
        "peak_memory": 1792,
        "elapsed_time": 0.23184999999999995,
        "result": "Test Case 0: PASSED"
    },
    {
        "peak_memory": 2240,
        "elapsed_time": 0.13049999999999998,
        "result": "Test Case 1: PASSED"
    },
    {
        "peak_memory": 1504,
        "elapsed_time": 0.09670000000000001,
        "result": "Test Case 2: PASSED"
    }
];


exports.EndGame = async function (gameId){
    //redise gir
    let players = await redis.getPlayersByGameId();

    console.log("END GAME players",players);

    // check for all players passed test result
    players.forEach(player => {
        console.log("player",player)
        player.Results.forEach(result => {
            console.log("result",result);
            player.isFailed = result.result.includes("FAILED")
        })
    })

    console.log("players",players);

    if( players[0].isFailed && players[1].isFailed ) {


        // oynadıkları oyun sayısı kaybedilen oyun sayısını falan güncelle

        // db üzerinden gerekli güncellemeyi yap.

        mysql.getStats(players[0].user_id, (resp) => {
            console.log("respp", resp)
        });

        mysql.getStats(players[1].user_id, (resp) => {
            console.log("respp", resp)
        })

        redis.destroyGame(gameId)
        return
    }


    const player0Score = players[0].result?.elapsed_time * players[0].result.peak_memory;
    const player1Score = players[1].result?.elapsed_time * players[1].result?.peak_memory;


    let winner;
    let looser;

    if ( player0Score < player1Score ) {
        winner = players[0]
        looser = players[1];
        console.log(`playerid ${players[0].user_id}`);
    } else if ( player0Score > player1Score ) {
        winner = players[1]
        looser = players[0];
        console.log("player 1 is winner ");
    } else {

        // beraberlik durumunda db bağlantısı yap statları güncelle
        mysql.updateElo(winner.playerId, winner.elo)
        mysql.updateElo(looser.playerId, looser.elo)
        console.log("beraberlik")
    }

    //eloları hesapla
    elo.calculateNewElos(winner, looser);

    console.log("winner",winner);
    console.log("looser",looser);

    
    //eloları güncelle
    mysql.updateElo(winner.playerId, winner.elo);
    mysql.updateElo(looser.playerId, looser.elo);


    //oyunu redisten kaldır
    redis.destroyGame(gameId);


}

