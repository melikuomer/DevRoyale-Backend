const jwt = require('jsonwebtoken');
const secret = require('../config.json').randomBytes;


exports.authenticateToken = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log("authHeader",token);
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, secret, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user_id = user.user_id;

        next();
    })
}


exports.getUserFromToken = function getUserFromToken(token){
    return jwt.decode(token, secret).user_id;
}

exports.createToken = function createToken(req, res, next){

}