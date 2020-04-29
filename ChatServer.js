
let express = require('express');
let app = express();
var server = require('http').createServer(app);
var io = require('socket.io')
    .listen(server);
var ent = require('ent'); // Permet de bloquer les caractères HTML

var mustache = require('mustache-express');
let consolidate = require('consolidate');
let path = require('path');
const pool = require('./core/database');
const pageRouter = require('./routes/pages');
const session = require('express-session');

//pour body parser
app.use(express.urlencoded({ extended : false }));
//server static files
app.use(express.static(path.join(__dirname,'/public')));



//config mettre en place le moteur de template
app.engine('html',mustache());
app.set('view engine', 'html');
app.set('views','./views');


//routes
app.use('/',pageRouter);

//errors : page not found
app.use((req,res,next)=>{
    var err = new Error('Page not found');
    err.status=404;
    next(err);
});

//handling errors and send msg to the user
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.send(err.message);
});

/**
 * List of connected users
 */
var users = [];

/**
 * Historique des messages
 */
var messages = [];

// pour le temps réel


io.sockets.on('connection', function (socket) {

    /**
     * Utilisateur connecté à la socket
     */
    var loggedUser;

    /**
     * Emission d'un événement "nouveau_client" pour chaque utilisateur connecté
    */
    for (i = 0; i < users.length; i++) {
        socket.emit('nouveau_client', users[i]);
    }


    /**
     * Emission d'un événement "chat-message" pour chaque message de l'historique
     */
    for (i = 0; i < messages.length; i++) {
        if (messages[i].pseudo !== undefined) {
            socket.emit('message', messages[i]);}

    }

//  on informe les autres personnes qu'un utilisateurs ss'est déconnecter

    socket.on('disconnect', function(pseudo) {

        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        if(loggedUser !== undefined){
           // socket.broadcast.emit('dis', pseudo);
            var userIndex = users.indexOf(loggedUser);
            if (userIndex !== -1) {
                users.splice(userIndex, 1);}
            socket.broadcast.emit('dis', loggedUser);
        }

    });



    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes

    socket.on('nouveau_client', function (pseudo) {
      //  socket.broadcast.emit('nouveau_client', pseudo);
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;

            // Sauvegarde de l'utilisateur et ajout à la liste des connectés
            loggedUser = pseudo;
            users.push(loggedUser);
            io.emit('nouveau_client', loggedUser);

        //sauvegarder les pseudos dans la bdd
        pool.query("INSERT INTO pseudonyme (pseudo) values (?) ",pseudo,(err,res)=>{});

    });




    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {

        message = ent.encode(message);
        //socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});

        message.pseudo = loggedUser;
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
        var data = {pseudo: socket.pseudo, message: message}
        messages.push(data);
        if (messages.length > 150) {
            messages.splice(0, 1);
        }
        //sauvegarder les messages dans la bdd
        pool.query("INSERT INTO messages (pseudo , message) values (?,?) ",[socket.pseudo,message],(err,res)=>{});



    })





});






server.listen(8080, ()=>{
    console.log("server is running on port 8080 . . .");
});

module.exports = app;