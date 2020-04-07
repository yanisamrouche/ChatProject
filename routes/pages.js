const express = require('express');
const User = require('../core/user')
const router = express.Router();

const user = new User();


router.get('/',(req,res,next)=>{
    res.render('index.mustache',{title:"Super Chat"});
});
//home

//login
router.get('/login',function (req,res) {
    res.render('login.mustache');
});

//register
router.get('/register',function (req,res) {
    res.render('register.mustache');
});
//post login
router.post('/login',function (req,res,next) {

    user.login(req.body.username, req.body.password, (result)=>{
        if(result){
           //res.send('logged in as : '+result.username);
            res.sendfile('./public/room.html');
        }else {
            res.send('Username or password incorrect');
        }
    })
});


//post register
router.post('/register',function (req,res,next) {

    let userInput = {
        username : req.body.username,
        fullname : req.body.fullname,
        password : req.body.password
    };

    user.create(userInput, (lastId)=>{
        if(lastId){
            //res.send('Welcome '+userInput.username);
            res.redirect('http://localhost:8080/');
        }else {
            console.log('Error creating a new user ');
        }
    })

});

router.get('/chat', function (req, res) {
    res.sendfile('./public/room.html');
});





module.exports = router;