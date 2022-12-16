const sql = require("./services/mysql-manager");


const parser = require("body-parser").json;
const express =require("express");
const cors = require("cors");
const app = express();


process.title = require("./package.json").name;

app.use(parser());
app.use(cors())
app.use(()=>{sql.query});

app.use('/matchmaking', require("./matchmaking/matchmaking.js"));
app.use()


app.listen(3000);






