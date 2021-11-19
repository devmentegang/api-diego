var express = require('express');
var router = express.Router();
const {jsonResponse} = require('../lib/jsonresponse');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET} = process.env;
const Token = require('../model/token.model');
const User = require('../model/users.model');
const authMiddleware = require('../auth/auth.middleware'); 

router.post('/signup',async (req,res,next) =>{
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
      const accessToken = user.createAccessToken();
      const refreshToken = await user.createRefreshToken();
      
      await user.save();
      res.json(jsonResponse(200,{
        
        message: 'You are a new user 🚀',
        accessToken: accessToken,
        refreshToken: refreshToken
      
      }));
    }

  }

});

router.post('/login',async (req,res,next) =>{
  const {username,password} = req.body;
  if(!username || !password){
    next(createError(400,
      'Username and or password missing 🤔'));
  }else if (username && password){
    try{
      let user = new User({username,password});
      const userExist = user.usernameExists(username);

      if(userExist){
        user = await User.findOne({username:username});
        const passwordCorrect = user.isCorrectPassword(password,user.password);
        if(passwordCorrect){
          const accessToken = user.createAccessToken();
          const refreshToken = await user.createRefreshToken();
          
          res.json(jsonResponse(200, {message:'User information correct',accessToken,expiresIn: "1d"}));
        }else{
          next(createError(400,'Username and/or password incorrect'));
        }
      }else{
        next(createError(400,'USername and/or password incorrect'));
      }

    }catch(error){
      res.json(jsonResponse(400, 'USername and/or password incorrect'));

    }


  }


});

// router.post('/logout',(req,res,next) =>{

// });

router.post('/refresh-token', async (req, res,next) => {
  const {refreshToken} = req.body;
  if(!refreshToken){
      next(createError(400,'No token provided'));
  };
  try{

      const tokenDoc = await Token.findOne({token: refreshToken});
      //console.error(error);

      if(!tokenDoc){
        next(createError(400,'No token found'));
      }else{
        const payload = jwt.verify(tokenDoc.token, REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({user: payload}, ACCESS_TOKEN_SECRET, {expiresIn: '1d'});

      res.json(jsonResponse(200,{
        message:'Access token updated.',
        accessToken
      }));
      }
  }catch(err){
    next(createError(400,err));
  }
});











module.exports = router;
