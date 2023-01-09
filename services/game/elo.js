const MAX_ELO_CHANGE = 200;


function eloCalculation(elo1,elo2){
    const eloMultiplier = 400;
    let player2prob = (1 / (1 + Math.pow(10, (elo1 - elo2) / eloMultiplier))); // elo formülü 1/(1+10^(elo1-elo2/400))
    console.log(player2prob)                                     // ortaya çıkan bir olasılık olacak.
    let player1prob = 1-player2prob;                                 //player 2 nin yenme olasılığı = 1- player 1 in yenme olasılığı
    console.log(player1prob)

    let x = [player1prob,player2prob]
    console.log(x)
    return x;
}

const clamp = function (num, min, max) {
    return Math.min(Math.max(num, min), max);
}

const  CalculateElo = function(players){
    
}



// deney kısmı
let player1 = 2730
let player2 = 2778
const p1win = false;
const p2win = true;
let value = Math.abs(player1-player2) + 12 // elo sabiti formülü
let a = eloCalculation(player1,player2);
let b = clamp(a[0] * value, -MAX_ELO_CHANGE, MAX_ELO_CHANGE); 
let c = clamp(a[1] * value,  -MAX_ELO_CHANGE, MAX_ELO_CHANGE);


if(p1win === true){ 
    player1 += c
    player2 -= c
} else {
    player2 += b
    player1 -= b
}

console.log(player1)
console.log(player2)