const mysql = require("mysql2");

const database = require("../config.json").database;

const con = mysql.createConnection({
  host: database.ip,
  user: database.username,
  password: database.password,
  database: database.database_name,
  connectTimeout: database.connectTimeout
});


exports.getUsers =  function (callback) {
  const sql = "SELECT * FROM users";
  con.query(sql, function (error, results, fields) {
    if (error) throw new Error(error);
    callback(null, results);
  });
};

exports.getUser = function (user_id,callback) {
  const sql = "SELECT * FROM users WHERE user_id = ?";
  con.query(sql, user_id ,function (error, results, fields) {
    if (error) return callback(error);
    callback(null, results);
  });
};

// need to check email in register
exports.getUserByEmail = async function (email,callback) {
  const sql = "SELECT * FROM users WHERE email = ?";
  con.query(sql, email ,function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results);
  });
};

exports.getQuestion = async function (question_id, callback) {
  const sql = "SELECT * FROM questions WHERE id = ?";
  con.query(sql, question_id ,function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results);
  });
};

exports.createQuestion = function (question, callback) {
  const sql = `INSERT INTO devroyale.questions(question)VALUES( ? );`
  con.query(sql,question, function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results.insertId);
  });
};



exports.updateElo = function (user_id, elo , callback) {
  const sql = `UPDATE stats SET elo = ? where user_id = ? ;`
  con.query(sql,[elo, user_id], function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results);
  });
};

exports.getElo = function (user_id, callback) {
  const sql = `SELECT users.user_id , stats.elo FROM users
  LEFT JOIN stats ON users.user_id = stats.user_id where users.user_id = ?;`
  con.query(sql,user_id, function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results);
  });
};



// TODO maybe add promises
// working ************************************************************
exports.createUser = function (newUser, callback) {
  const sql = `INSERT INTO devroyale.users(first_name,last_name,email,password,create_time)VALUES(
    "${newUser.firstName}" ,
    "${newUser.lastname}",
    "${newUser.email}",
    "${newUser.password}",
    now());`
  con.query(sql, function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results.insertId);
  });
};

exports.createStats = function (user_id, callback) {
  const sql = `INSERT INTO devroyale.stats VALUES (
    "${user_id}" ,
    0 ,
    0 ,
    0 ,
    1500 ,
    0 , 
    0 , 
    0 
    );`
  con.query(sql, function (error, results) {
    if (error) return callback(new Error(error),null);
    callback(null, results);
  });
};

exports.getStats = function (user_id, callback) {
  const sql = `SELECT * devroyale.stats WHERE = ?;`
  con.query(sql,user_id, function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results.insertId);
  });
}


exports.getProfile = function (user_id, callback) {
  const sql = `SELECT * FROM users
  LEFT JOIN stats ON users.user_id = stats.user_id where users.user_id = ?;`;
  con.query(sql, user_id , function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results[0]);
  });
};


exports.updateUser = function (id, updates, callback) {
  const sql = "UPDATE users SET ? WHERE id = ?";
  con.query(sql, [updates, id], function (error, results, fields) {
    if (error) return callback(new Error(error),null);
    callback(null, results.affectedRows);
  });
};

// working
exports.deleteUser = function (user_id, callback) {
  const sql = "DELETE FROM users WHERE id = ?";
  con.query(sql, user_id, function (error, results, fields) {
    if (error) throw callback(error, null);
    callback(null, results.affectedRows);
  });
};


