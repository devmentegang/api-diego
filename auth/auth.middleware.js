require('dotenv').config();
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

exports.checkAuth = function(req,res,next){

    const header = req.header('Authorization');

    if(!header){
        throw new Error('Access Denied');
    }else{
        const [bearer, token] = header.split(' ')

        if(bearer == 'Bearer' && token){
            try{
                const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
                req.user = payload.user;
                next();
            } catch(error){
                if(error.name == 'TokenExpiredError'){
                    throw new Error('Token expired. Login again.');
                }else if(error.name == 'JsonWebTokenError'){
                    throw new Error('Token is not valid. Login again or use the refresh token.');
                }
            }
        }else{
            throw new Error('Token incorrect');
        }    
    }
}