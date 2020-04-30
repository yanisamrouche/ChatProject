const util = require('util');
const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit: 10,
    host : 'localhost',
    user : 'root',
    password : 'yanis',
    database : 'mydb'
});

con.getConnection((err,connection)=>{
    // creation de la bdd mydb
    con.query("CREATE DATABASE mydb", function (err, result) {

        console.log("Database mydb created");
    });

    var sql = "CREATE TABLE users (id int AUTO_INCREMENT,username VARCHAR(255), fullname VARCHAR(255),email VARCHAR(255),password VARCHAR(255), PRIMARY KEY (id))";
    con.query(sql, function (err, result) {
        console.log("Table users created");
    });
    var sql2 = "CREATE TABLE pseudonyme (id int AUTO_INCREMENT,pseudo VARCHAR(255), PRIMARY KEY (id))";
    con.query(sql2, function (err, result) {
        console.log("Table pseudonyme created");
    });
    var sql3 = "CREATE TABLE messages (id int AUTO_INCREMENT,pseudo VARCHAR(255), message VARCHAR(255), PRIMARY KEY (id))";
    con.query(sql3, function (err, result) {
        console.log("Table messages created");
    });
    if(connection)
        connection.release();
    return;
});


con.query = util.promisify(con.query);

module.exports = con;