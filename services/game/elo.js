const MAX_ELO_CHANGE = 200; // elo clamping constant
const eloMultiplier = 400;  // elo formula constant
const kFactorPlayedGameReq = 30; // played game requirement for K factor
const kFactorEloThreshold = 2400; // sets elo threshold for K factor
const kFactorBelowPlayedGameReq = 40;
const kFactorBelowThreshold = 20;
const kFactorAboveThreshold = 10;

const clamp = function (num, min, max) { // clamping function that prevents extraordinary elo loss, if k factor values changes, we'll need that function
    return Math.min(Math.max(num, min), max);
}

var player1 = { // test player 1 
    id : 1,
    elo : 2500,
    kFactor:1, 
    playedGames:56,
}

var player2 = { // test player 2 
    id : 2,
    elo: 1600,
    kFactor:1,
    playedGames:28,
 }

 const setKFactor = function(player){ // It's a value for elo calculation.
    if(player.playedGames < kFactorPlayedGameReq){ // if less from playedgame
        player.kFactor = kFactorBelowPlayedGameReq;
    } else{
        return player.kFactor = player.elo < kFactorEloThreshold ? kFactorBelowThreshold : kFactorAboveThreshold; // If elo bigger than threshold, k factor equals below threshold.else above.
    }
 }

const calculateNewElos = function(winnerPlayer,loserPlayer){ // calculates new elos for each player after game ends
        let loserPlayerEloProb = (1 / (1 + Math.pow(10, (winnerPlayer.elo - loserPlayer.elo) / eloMultiplier))); // Elo Formula: 1/(1+10^(elo1-elo2/400))
        setKFactor(winnerPlayer)
        winnerPlayer.elo += clamp(loserPlayerEloProb * winnerPlayer.kFactor,  -MAX_ELO_CHANGE, MAX_ELO_CHANGE); // calculate winnerplayer new elo
        loserPlayer.elo -= clamp(loserPlayerEloProb * winnerPlayer.kFactor,  -MAX_ELO_CHANGE, MAX_ELO_CHANGE);  // calculate loserplayer new elo
}

calculateNewElos(player2,player1);


module.exports.calculateNewElos = calculateNewElos;