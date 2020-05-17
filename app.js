//jshint esversion: 6
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const util = require(__dirname+'/util.js');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


 //db
 mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true});

 const userSchema = mongoose.Schema({
     email: {
       type: String,
       required: [true, "use a email id"]
     },
     password: {
       type: String,
       required: [true, "use a password"]
     }
 });
 const User = new mongoose.model('user', userSchema);




app.get('/', function(req, res){
  res.render('home');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  util.saveUser(req, res, User);
  res.render('secrets');
});

app.get('/login', function(req, res){
  res.render('login', {errors: []});
})

app.post('/login', function(req, res){
  founduser = util.getUser(req, res, User);
  res.render('secrets');
});

app.get('/logout', function(req, res){
  res.render('home');
});

app.get('/submit', function(req, res){
  res.render('submit');
});










//post specific
app.post("/users", function(req, res){
  util.saveUser(req, res, User);
});

//get specific
app.get("/users/:id", function(req, res){
  util.getUser(req, res, User);
});

//replace specific
app.put("/users/:id", function(req, res){
  user = new User({ email: req.body.email, password: req.body.password });
  User.replaceOne({ _id: req.params.id }, { email: req.body.email, password: req.body.password }, function(err, writeOpResult){
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(writeOpResult);
      res.sendStatus(200);
    }
  });
});

//update specific
app.patch("/users/:id", function(req, res){
  User.updateOne({ _id: req.params.id }, { password: req.body.password }, function(err){
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

//delete specific
app.delete("/users/:id", function(req, res){
  User.deleteOne({ _id: req.params.id }, function(err){
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});




//port settings
let port = process.env.PORT;
app.listen(port || 3000, function(){
  console.log("server started at port 3000");
});
