md5 = require('md5');
exports.saveUser = function(req, res, User){
  user = new User({
    email:req.body.email,
    password:md5(req.body.password),
  });
  User.create(user, function(err, doc){
      if (err) {
        console.log(err);
        res.status(500).send(e);
      } else {
        console.log('Saved User: ',req.body.email, md5(req.body.password));
      }
  });
};

exports.getUser = function(req, res, User){
  User.findOne({ email: req.body.email }, function(err, founduser){
    if (err) {
      console.log('error in getUser findOne: ',err);
    } else {
      if(null==founduser || founduser.password!=md5(req.body.password)){
        console.log('Authentication error: ',req.body.email);
        res.render('login', {errors: ['Authentication Error, Please try again']});
      }else{
        console.log('Logged In! ',req.body.email)
        res.render('secrets');
      }
    }
  });
};
