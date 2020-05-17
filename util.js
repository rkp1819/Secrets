exports.saveUser = function(req, res, User){
  console.log(req.body.email);
  console.log(req.body.password);

  user = new User({
    email:req.body.email,
    password:req.body.password,
  });
  User.create(user, function(err, doc){
      if (err) {
        console.log(err);
        res.status(500).send(e);
      } else {
        console.log('Saved User: ',req.body);
      }
  });
};

exports.getUser = async function(req, res, User){
  docs = await User.findOne({ email: req.body.email, password: req.body.password },{}, function(err, founduser){
    if (err) {
      res.status(500).send(err);
    } else {
      console.log('founduser', founduser);
      if(null == founduser){
        console.log('Authentication error: ',req.body);
        res.render('login', {errors: ['Authentication Error, Please try again']});
      }else{
        console.log('Logged In! ',req.body)
      }
    }
  });
  return docs;
};
