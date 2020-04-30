const express = require('express');
const User = require('../core/user');
const router = express.Router();
const user = new User();

var data = {title    : "Super Tchat",
            welcome   : "Bienvenue",
            hometitle: "Chat temps réel",
            description : "permet l’échange instantané de messages" +
                " textuels entre plusieurs personnes " ,

            home : "Home",
            login    : "Login",
            register : "Register"};


router.get('/',(req,res,next)=>{
    res.render('index.html',  data);
});
//home

//login
router.get('/login', function (req,res) {
    res.render('login.html');
});

//register
router.get('/register',function (req,res) {
    res.render('register.html');
});
//post login
router.post('/login',function (req,res,next) {

    user.login(req.body.email, req.body.password, (result)=>{
        if(result){
            //res.sendfile('./public/room.html');
            res.sendfile('./public/room.html');
        }else {
            res.send('email or password incorrect');
        }
    })
});


//post register
router.post('/register',function (req,res,next) {

    let userInput = {
        username : req.body.username,
        fullname : req.body.fullname,
        email    : req.body.email ,
        password : req.body.password
    };

    user.create(userInput, (lastId)=>{
        if(lastId){
            //res.send('Welcome '+userInput.username);
            res.redirect('http://localhost:8080/login');
        }else {
            console.log('Error creating a new user ');
        }
    })

});

//si on accéde au tchat sans passé par le login
const redirectToLogin = (req,res,next)=>{
    if(User.prototype.login){
        res.redirect('http://localhost:8080');    }
    else {
        next();
    }


}

router.get('/chat',redirectToLogin,function (req, res) {
    res.sendfile('./public/room.html');});



module.exports = router;