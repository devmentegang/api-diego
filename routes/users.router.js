var express = require('express');
var router = express.Router();
const User = require('../model/users.model');
const {jsonResponse} = require('../lib/jsonresponse');
const createError = require('http-errors');


router.get('/', async function(req, res, next) {
  let results = {};

  try{
    results = await User.find({},'username password');
  }catch(ex){
    
  }
  res.json(results);
  res.send('respond with a resource');
});

router.post('/',async function(req,res,next){
  const {username,password} = req.body;
  if(!username || !password){
    next(createError(400,
      'Username and or password missing 🤔'));
  }else if (username && password){
    const user = new User({username,password});
    const exists = await user.usernameExists(username);

    if(exists){
      next(createError(400,'Username is taken. Come on! Try with another one 😁'));
      
    }else{
      await user.save();
      res.json(jsonResponse(200,
        'You are a new user 🚀'));
    }

  }
})

module.exports = router;
