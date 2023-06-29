const {authenticateToken, getUserFromToken} = require('./services/jwtService.js');

const express =require("express");
const cors = require("cors");
const app = express();



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
        
        
             
        queries.getElo(userId, (err, value)=>{ //Get user stats from db
            if(err) console.log(err);
            
            let player = {id: value[0].user_id, elo:value[0].elo};
            console.log()
            queue.AddPlayer([player, null]);
        });
    })
    
    
    socket.on('Test', ({code, gameId})=>{
        console.log('gameObject: ' +gameId);
        //let gameId = gameObject.gameId;
        console.log(code +'\n'+ gameId);
        
        if (!redis.isUserInTheGame(userId,gameId)) {
            console.err('User is not in a game');
            return;
        }
        //Test the code
        redis.getQuestionByGameId(gameId).then(rawQuestion=>{
            const question = JSON.parse(rawQuestion);
            console.log(question);
            const {err,results} = testProgram(question.TestCases, question.ExpectedResults, code);
    
            if(err)
            {
                socket.emit('Results', {error:err})
                return;
            }
            //kullanıcıya sonuçları gönder;
            socket.emit('Results', {results:results});

        });
       
    })

    socket.on('Submit', ({code, gameId})=>{
        if (!redis.isUserInTheGame(userId,gameId)) {
            console.error('User is not in a game');
            return;
        }
        //Test the code
        redis.getQuestionByGameId(gameId).then(rawQuestion=>{
            const question = JSON.parse(rawQuestion);
            console.log(question);
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





