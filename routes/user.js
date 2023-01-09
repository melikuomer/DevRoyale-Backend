const express = require("express");
const router = express.Router({});
const bcrypt = require("bcrypt");
const queries = require("../services/mysql-manager.js");
const {authenticateToken} = require("./../services/jwtService");


module.exports = router;

// NOT WORKİNG NOW

// TODO use params
// TODO working now copt this to others
function RegisterUser(req, response) {
    console.log("RegisterUser Route");
  let newUser = {
    firstName: req.body.firstName,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password, //todo add passwd security
  };

  // BÖYLE ÇALIŞMIYOR 
  
  // queries.getUserByEmail(newUser.email, (error, resp) => {
  //   if (error) return response.send(error.toString());
  //   console.log("resp.length", resp.length);
  //   if (resp.length < 1) {
  //       queries.createUser(newUser, (error, user_id) => {
  //         if (error) return response.send(error.toString());
  //         return response.json(JSON.stringify(user_id));
  //       });        
  //   } else {
  //     return response.json("this email is duplicate");
  //   }
  // })
  queries.createUser(newUser, (error, user_id) => {
  if (error) return response.send(error.toString());
  return response.json(JSON.stringify(user_id));})

}


// TODO maybe add jwt
function getUser(req, response) {
    // req.user = user_id 
    // console.log(req.user.user_id)
    queries.getUser(req.user.user_id, (error, resp) => {
        if (error) return response.status(404);
        return response.json(resp);
    });
}

function updateUser(req, response) {
  const user_id = req?.body?.user_id;
  queries.getUser(user_id, (error, resp) => {
      if (error) return response.status(404);
      return response.json(resp);
  });

}


function deleteUser(req, response) {
  const user_id = response?.body?.user_id;
  queries.deleteUser(user_id,(err,resp) => {
    if (err) return response.send(err.toString());
  return response.json(resp)
})
}


router.post("/", RegisterUser);
// todo register new user while encrypting and salting the password with 'bcrypt'
// todo if user with same email exists return error
// todo verify user input
// todo generate random bytes on config file for encrypting purposes

router.get("/", authenticateToken , getUser);
// get user with parameter
// check jwt with user parameter optional
// then

router.put("/", updateUser);
// todo update user function
// must have jwt

router.delete("/",deleteUser);
// todo delete function 


