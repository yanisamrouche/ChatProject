
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent'); // Permet de bloquer les caractères HTML
var mustache = require('mustache-express');
const path = require('path');
const pageRouter = require('./routes/pages');

//pour body parser
app.use(express.urlencoded({ extended : false }));
//server static files
app.use(express.static(path.join(__dirname,'public')));



//config mustache mettre en place le moteur de template
app.engine('mustache',mustache());
app.set('view engine', 'mustache');
app.set('views',__dirname+'/views');

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


io.sockets.on('connection', function (socket, pseudo) {


    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });

});






server.listen(8080, ()=>{
    console.log("server is running on port 8080 . . .");
});

module.exports = app;