const {authenticateToken, getUserFromToken} = require('./services/jwtService.js');

const express =require("express");
const axios = require('axios');
const cors = require("cors");
const app = express();
const code_beauty =require("./services/game/code-beauty-analysis/MaintainabilityIndex.js");
// type defs

const AvailableLanguages = {
    JavaScript: "JavaScript",
    Python: "Python",
    Cpp: "C++"
}

const AxiosHeaders = {
    headers: {
        'Content-Type': 'application/json'
    }
}

const microServices = require("./config.json").microServices;




const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })



const queue = require('./services/game/matchmaking.js');
const queries = require("./services/mysql-manager.js");
const redis = require('./services/game/redis-helper.js');
const { testProgram } = require('./services/game/code-tester.js');
const game = require('./services/game/game.js');
const { getRandomValues } = require('crypto');

process.title = require("./package.json").name;

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


app.use(cors());

app.use(((req, res, next) =>{
    console.log(req.header('Authorization'));
    next();
}));

app.use(express.static('static'));


app.use('/session',require("./routes/session.js"));
app.use('/user',require("./routes/user.js"));
app.use('/register',require("./routes/register.js"));
app.use('/login',require("./routes/login.js"));
app.use('/question', require("./routes/question.js"));
app.use(authenticateToken);
app.use('/profile',require("./routes/profile.js"));


io.on('connect', (socket) => {
    const token = socket.request.headers.authorization.split(' ')[1]; //Get Token From Header;
    if(!token) return;
    const userId = getUserFromToken(token); //Convert Token to User Id;

    if(userId)
    redis.createUserConnection(userId, socket.id); //Create a map to easily access the socket with userId
    
    socket.on('JoinQueue', (data)=>{
        
        console.log("JoinQueue data ", data);
             
        queries.getElo(userId, (err, value)=>{ //Get user stats from db
            if(err) console.log(err);
            
            let player = {id: value[0].user_id, elo:value[0].elo};
            queue.AddPlayer([player, null]);
        });
    })
    
    socket.on('Test', ({code, gameId, language})=>{
        console.log('gameObject: ' +gameId);
        //let gameId = gameObject.gameId;
        console.log(code +'\n'+ gameId);
        console.log("userId",userId);
        console.log("language",language)

        
        if (!redis.isUserInTheGame(userId,gameId)) {
            console.err('User is not in a game');
            return;
        }
        //Test the code
        redis.getQuestionByGameId(gameId).then(rawQuestion=>{
            const question = JSON.parse(rawQuestion);
            console.log(question);

            let endPoint = MicroServiceURL(language);

            var jsonString = Buffer.from(code);
            let value = jsonString.toString("base64");

            const gatewayBody = {
                "code": value,
                "test_cases": question.TestCases,
                "expected_results": question.ExpectedResults
            }

            console.log("gatewayBody",gatewayBody);

            axios.post(endPoint,gatewayBody)
                .then(response => {
                    console.log(response.data)
                    socket.emit('Results', response.data )
                }).catch( error => {
                    console.log("error.message 1",error.message)
                    socket.emit('Results', error )
            })


        });

    })

    socket.on('Submit', ({code, gameId, language})=>{


        if (!redis.isUserInTheGame(userId,gameId)) {
            console.error('User is not in a game');
            return;
        }
        //Test the code
        redis.getQuestionByGameId(gameId).then(rawQuestion=>{
            const question = JSON.parse(rawQuestion);
            console.log(question);

            // get MicroService URL
            const endPoint = MicroServiceURL(language);

            var jsonString = Buffer.from(code);
            let value = jsonString.toString("base64");

            const gatewayBody = {
                "code": value,
                "test_cases": question.TestCases,
                "expected_results": question.ExpectedResults
            }

            console.log("gatewayBody",gatewayBody);

            axios.post(endPoint,gatewayBody)
                .then(response => {
                    console.log("response.data",response.data)
                    socket.emit('Results', response.data )

                    //let tempPlayer = redis.getPlayer(gameId, userId);

                    //console.log("tempPlayer",tempPlayer);

                    let  maintainabilityIndex =code_beauty.FindBeautyParameters(userId, value,LanguageToHFormat(language)) ;
                    console.log("mindex", maintainabilityIndex);
                    let endgame = function(player){
                        console.log("player",player);
                        
                        player.Results = response.data;
                        player.Submitted = true;
                        player.code_beauty = maintainabilityIndex;
                        console.log("player",player);
                        redis.setPlayer(gameId, player);
                        // sonuçları redise yaz

                        redis.GetOtherPlayer(gameId, userId, (player)=>{
                            if(player.Submitted) game.EndGame(gameId);
                        })
                    } 
                    
                    redis.getPlayer(gameId, userId , endgame);
                    

                }).catch( error => {
                console.log("error.MESSAGE",error )
                socket.emit('Results', error )
            })






            /*
            const {err,results} = testProgram(question.TestCases, question.ExpectedResults, code);

            if(err)
            {
                socket.emit('Results', {error:err})
                return;
            }
            //kullanıcıya sonuçları gönder;
            socket.emit('Results', {results:results});

            let player =redis.getPlayer(gameId, userId)
            player.Results = results;
            player.Submitted = true;
            redis.setPlayer(gameId, player);
            // sonuçları redise yaz
            if(redis.GetOtherPlayer(gameId, userId).Submitted){
                game.EndGame(gameId);
            }

             */


        });
        //bağlantıyı sonlandır.

    })

    console.log(`User ${userId} has connected`);

});


queue.Event.on('MatchFound',(players)=>{

    queries.getQuestion(1,(err, question)=>{

        if (err) console.log(err);
        redis.createGame(players, question[0].question).then((gameId)=>{
            let {TestCases, ExpectedResults, ...finalQuestion} = question[0].question;
            console.log('eslestirildi, oyun kodu:' +gameId +' oyuncular: ' + JSON.stringify(players));
            setTimeout(()=>{

                game.EndGame(gameId);


            }, question[0].question.RequiredTimebyMinute*1000*60)
            players.forEach(player => {
                redis.getUserConnection(player.id).then(value=>{
                    io.to(value).emit('MatchFound',{gameId:gameId,question:finalQuestion});
                });
            });
        });

    });

})

io.on('disconnect', (socket)=>console.log(socket.id));


server.listen(3000, ()=>{
    console.log("server is running on port: 3000");
});

app.on('error', (err)=> {
    console.log(err)
});

function MicroServiceURL( language ) {
    let endPoint;
    switch (language) {
        case AvailableLanguages.Cpp:
            // TODO melikşah'ın url'i ve portu eklenmesi lazım
            endPoint = `http://${microServices.Cpp.url}:${microServices.Cpp.port}`;
            break
        case AvailableLanguages.JavaScript:
            // must need body
            endPoint = `http://${microServices.Javascript.url}:${microServices.Javascript.port}/code-statistics`;
            break
        case AvailableLanguages.Python:
            endPoint = `http://${microServices.Pyhton.url}:${microServices.Pyhton.port}/code-statistics`;
            break
        default:
            endPoint = `http://${microServices.Javascript.url}:${microServices.Javascript.port}/code-statistics`;
            break
    }
    return endPoint;
}

function LanguageToHFormat( language) {
    let lang
    switch (language) {
        case AvailableLanguages.Cpp:
            // TODO melikşah'ın url'i ve portu eklenmesi lazım
            lang = "cpp"; 
            break
        case AvailableLanguages.JavaScript:
            // must need body
            lang = "js";
            break
        case AvailableLanguages.Python:
            lang = "py"
            break
        default:
            console.error("language not supported");
            break
    }


    return lang;
}


