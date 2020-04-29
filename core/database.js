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

    var sql = "CREATE TABLE users (id int ,username VARCHAR(255), fullname VARCHAR(255),email VARCHAR(255),password VARCHAR(255), PRIMARY KEY (id))";
    con.query(sql, function (err, result) {
        console.log("Table users created");
    });
    if(connection)
        connection.release();
    return;
});


con.query = util.promisify(con.query);

module.exports = con;