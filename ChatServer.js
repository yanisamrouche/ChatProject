
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



/*
// Chargement de la page room.html
app.get('/chat', function (req, res) {
    res.sendfile(__dirname + '/room.html');
});
*/


io.sockets.on('connection', function (socket) {


    var getLastMessages = function(){
        pool.query("SELECT pseudo , message from messages",function (error,rows) {

            var messages = [];
            for(k in rows){
                var row =rows[k];
                var message = {
                    pseudo : row.pseudo,
                    message : row.message

                };
                messages.push(message);
            }
            socket.broadcast.emit('message',messages);

        })
    };




    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo,callback) {
         //
         pseudo = ent.encode(pseudo);
         socket.pseudo = pseudo;
         socket.broadcast.emit('nouveau_client', pseudo);
                  //sauvegarder les pseudos dans la bdd


         pool.query("INSERT INTO pseudonyme (pseudo) values (?) ",pseudo,(err,res)=>{});
                 // getLastMessages();

    });

    socket.on('disconnect', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('dis', pseudo);

    });


    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {

        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
        //sauvegarder les messages dans la bdd
        pool.query("INSERT INTO messages (pseudo , message) values (?,?) ",[socket.pseudo,message],(err,res)=>{});



    })





});




server.listen(8080, ()=>{
    console.log("server is running on port 8080 . . .");
});

module.exports = app;