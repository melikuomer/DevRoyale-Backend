const sql = require("./services/mysql-manager");


const parser = require("body-parser");
const express =require("express");
const cors = require("cors");
const {sseMiddleware} = require("express-sse");
const app = express();

const jwt = require("jsonwebtoken");


process.title = require("./package.json").name;

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

app.use(express.static('static'));

app.use('/session',require("./routes/session.js"))
app.use('/matchmaking', require("./matchmaking/matchmaking.js"));


app.listen(3000, (value)=>{
    console.log("server is running on port: 3000");
});

app.on('error', (err)=>console.log(err));





