const {authenticateToken, getUserFromToken} = require('./services/jwtService.js');

const express =require("express");
const cors = require("cors");
const app = express();



const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server)






const queue = require('./services/game/matchmaking.js');
const queries = require("./services/mysql-manager.js");
// const {createUserConnection, isUserInTheGame, getQuestionByGameId, removePlayerFromGame, getPlayersByGameId} = require('./services/game/redis-helper.js');
const { testProgram } = require('./services/game/code-tester.js');


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





// io.on('connect', (socket) => {
//     const token = socket.request.headers.authorization.split(' ')[1]; //Get Token From Header;
//     const userId = getUserFromToken(token); //Convert Token to User Id;
//     if(userId)
//     createUserConnection(userId, socket.id); //Create a map to easily access the socket with userId
    
//     socket.on('JoinQueue', (value)=>{
        
        
//         let elo = queries.getUser(userId, (err, value)=>{ //Get user stats from db
//             if(err) console.log(err);
//             console.log(value);
//         });
//         //queue.AddPlayer({id: id, elo: elo}) //Push player into queue
//         //console.log(JSON.stringify(stuff))
//     })
    
    
//     socket.on('Test', ({code, gameId})=>{
//         if (!isUserInTheGame(userId,gameId)) {
//             console.err('User is not in a game');
//             return;
//         }
//         //Test the code
//         const question =getQuestionByGameId(gameId);
//         const {err,results} = testProgram(question.testCases, question.expectedOutputs, code);

//         if(err)
//         {
//             //kullanıcıya malsın de
//             //returnle
//         }

//         //kullanıcıya sonuçları gönder;
//     })

//     socket.on('Submit', (code)=>{
//         if (!isUserInTheGame(userId,gameId)) {
//             console.err('User is not in a game');
//             return;
//         }
//         //Test the code
//         const question =getQuestionByGameId(gameId);
//         const {err,results} = testProgram(question.testCases, question.expectedOutputs, code);

//         if(err)
//         {
//             //kullanıcıya malsın de
//             //returnle
//         }

//         //kullanıcıya sonuçları gönder;
//         //bağlantıyı sonlandır.
//         removePlayerFromGame(gameId, userId);
//         if(getPlayersByGameId(gameId).length<1){
//             // Maçı bitir
//             //kazananı seç
//             //update elo
//         } 
//     })

//     console.log(`User ${userId} has connected`);

// });




// io.on('disconnect', (socket)=>console.log(socket.id));


server.listen(3000, ()=>{
    console.log("server is running on port: 3000");
});

app.on('error', (err)=> {
    console.log(err)
});





