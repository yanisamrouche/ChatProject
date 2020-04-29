const pool = require('./database');
//pour le hachage du mot de passe
const bcrypt = require('bcrypt');

function User() {};

User.prototype = {
    //trouver l'utilisateur avec id ou username
    find: function (user = null, callback) {
        //si le user = number le retour est field =id
        //si le user = string le retour est field =email
        if (user) {
            var field = Number.isInteger(user) ? 'id' : 'email';
        }
        let sql = `SELECT * FROM users WHERE ${field} = ?`;
        pool.query(sql, user, (err, result) => {
            if (err) throw err;
            if (result.length)
                callback(result[0]);
        });
    },
    create : function (body, callback)
    {

            let pwd = body.password;

            body.password = bcrypt.hashSync(pwd, 10);
            //mettre les valeurs dans le tableau bind
            var bind = [];
            for (prop in body) {
                bind.push(body[prop]);
            }
            let sql = `INSERT INTO users(username, fullname, email,password) VALUES (?, ?, ?,? )`;
            pool.query(sql, bind, function (err, lastId) {
                if (err) throw err;
                callback(lastId);
            });

    },
    login : function (email,password,callback)
    {
       this.find(email,function (user) {
           if(user){
               if(bcrypt.compareSync(password,user.password)){
                   callback(user);
                   return;
               }
           }
           callback(null);
       });
    }


};
module.exports = User;