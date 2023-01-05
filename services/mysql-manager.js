const mysql = require("mysql2");

const database = require("../config.json").database;

const con = mysql.createConnection({
  host: database.ip,
  user: database.username,
  password: database.password,
  database: database.database_name,
});

// we need to make this functions async

exports.getUsers = function (callback) {
  const sql = "SELECT * FROM users";
  con.query(sql, function (error, results, fields) {
    if (error) return callback(error);
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

exports.createUser = function (newUser, callback) {
  // not working now 
  console.log("newUser",newUser);
  const sql = `INSERT INTO devroyale.users(first_name,last_name,email,password,create_time)VALUES(
    "${newUser.firstName}" ,
    "${newUser.lastname}",
    "${newUser.email}",
    "${newUser.password}",
    now());`
  con.query(sql, function (error, results, fields) {
    if (error) return callback(error);
    callback(null, results.insertId);
  });
};

exports.updateUser = function (id, updates, callback) {
  const sql = "UPDATE users SET ? WHERE id = ?";
  con.query(sql, [updates, id], function (error, results, fields) {
    if (error) return callback(error);
    callback(null, results.affectedRows);
  });
};

exports.deleteUser = function (id, callback) {
  const sql = "DELETE FROM users WHERE id = ?";
  con.query(sql, id, function (error, results, fields) {
    if (error) return callback(error);
    callback(null, results.affectedRows);
  });
};
