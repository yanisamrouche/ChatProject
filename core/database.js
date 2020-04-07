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
    // if(err)
    //     console.error("Error");
    if(connection)
        connection.release();
    return;
});

con.query = util.promisify(con.query);

module.exports = con;