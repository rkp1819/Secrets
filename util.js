// md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.saveUser = function(req, res, User){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      user = new User({
        email:req.body.email,
        password:hash,
      });
      User.create(user, function(err, doc){
          if (err) {
            console.log(err);
            res.status(500).send(e);
          } else {
            console.log('Saved User: ',req.body.email, hash);
          }
      });
  });


};

exports.getUser = function(req, res, User){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      User.findOne({ email: req.body.email }, function(err, founduser){
        if (err) {
          console.log('error in getUser findOne: ',err);
        } else {
          bcrypt.compare(req.body.password, hash, function(err, result) {
            if(!result){
              console.log('Authentication error: ',req.body.email);
              res.render('login', {errors: ['Authentication Error, Please try again']});
            }else{
              console.log('Logged In! ',req.body.email)
              res.render('secrets');
            }
          });
        }
      });
  });

};
