const sql = require("./services/mysql-manager");

const express =require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");


const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server)


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
app.use('/matchmaking', require("./routes/matchmaking.js"));
app.use('/user',require("./routes/user.js"));
app.use('/register',require("./routes/register.js"));
app.use('/login',require("./routes/login.js"))

io.on('connection', (socket) => {
    //socket.emit('GameState', {Zort:'Yetkini Siktim'})
    socket.on('JoinQueue', (value)=>{
        console.log(JSON.stringify(value))
    })
    console.log('a user connected');

  });

server.listen(3000, (value)=>{
    console.log("server is running on port: 3000");
});

app.on('error', (err)=> {
    console.log(err)
});





