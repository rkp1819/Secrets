//jshint esversion: 6
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const md5 = require('md5');
const ejs = require('ejs');
const app = express();
const util = require(__dirname+'/util.js');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')

mongoose.set('useCreateIndex', true);
console.log("Environment: ",app.get('env'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// const encrypt = require('mongoose-encryption');

//session stuff
const sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))

//passport stuff
app.use(passport.initialize());
app.use(passport.session());

 //db
 mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true});

 const userSchema = new mongoose.Schema({
     username: {
       type: String,
       // required: [true, "use a username id"]
     },
     password: {
       type: String,
       // required: [true, "use a password"]
     }
 });

// const encKey = process.env.SOME_32BYTE_BASE64_STRING;
// const sigKey = process.env.SOME_64BYTE_BASE64_STRING;
// userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['password'] });
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

//passportLocalMongoose stuff

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', function(req, res){
  res.render('home');
});

app.get('/register', function(req, res){
  console.log("---------------register get route-----------------");
  res.render('register');
});

app.post('/register', function(req, res){
  // util.saveUser(req, res, User);
  // res.render('secrets');
  console.log("------------Register post route------------------");
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect('/secrets');
      });
    }
  });
});

app.get('/login', function(req, res){
  console.log("---------------login get route--------------------");
  res.render('login', {errors: []});
})

app.post('/login', function(req, res){
  console.log("-------------------login post route---------------------");
  // util.getUser(req, res, User);
  console.log(req.body);
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
      passport.authenticate('local', function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          console.log('user: ', user, 'err: ', err, 'info', info);
          return res.render('login', {errors: [info.message]});
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect('secrets');
        });
      })(req, res, next=function(err){
        console.log('err: ', err);
        res.render('login', {errors: [err]})
      });
});

app.get('/logout', function(req, res){
  console.log("------------------logout get route------------------");
  req.logout();
  res.redirect('/');
});

app.get('/submit', function(req, res){
  res.render('submit');
});


app.get('/secrets', function(req, res){
  console.log("-------------------Secrets get route---------------------");
  if(req.isAuthenticated()){
    res.render('secrets');
  }else{
    res.redirect('/login');
  }
});










//port settings
let port = process.env.PORT;
app.listen(port || 3000, function(){
  console.log("server started at port 3000");
});
