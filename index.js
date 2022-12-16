const sql = require("./services/mysql-manager");


const parser = require("body-parser").json;
const express =require("express");
const cors = require("cors");
const {sseMiddleware} = require("express-sse-middleware");
const app = express();


process.title = require("./package.json").name;

app.use(parser());
app.use(cors())
app.use(sseMiddleware)


app.use('/matchmaking', require("./matchmaking/matchmaking.js"));
app.use('/',(req,res)=>  res.send("cool"))


app.listen(3000, ()=>{
    console.log("server is running on port: 3000" )
});






