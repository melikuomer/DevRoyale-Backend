function eloCalculation(elo1,elo2){
    player2prob = (1 / (1 + Math.pow(10, (elo1 - elo2) / 400))); // elo formülü 1/(1+10^(elo1-elo2/400))
    console.log(player2prob)                                     // ortaya çıkan bir olasılık olacak.
    player1prob = 1-player2prob;                                 //player 2 nin yenme olasılığı = 1- player 1 in yenme olasılığı
    console.log(player1prob)

    x = [player1prob,player2prob]
    console.log(x)
    return x;
}

function truncate(value){ //  truncate functionu sayıları kontrol etmek için
    if(value > 200){
        return 200;
    }
    else if (value < -200){
        return -200;
    }
    else{
        return value;
    }

}

// deney kısmı
p1 = 2730
p2 = 2778
p1win = false;
p2win = true;
value = Math.abs(p1-p2) + 12 // elo sabiti formülü
a = eloCalculation(p1,p2);
b = truncate(a[0] * value) 
c = truncate(a[1] * value)
if(p1win === true){ 
    p1 += c
    p2 -= c
}

else if(p2win === true){

    p2 += b
    p1 -= b
}

console.log(p1)
console.log(p2)