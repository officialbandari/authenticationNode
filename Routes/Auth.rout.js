const express = require('express');
const createErrors = require('http-errors');
const User  = require('../models/User.model');
const {authSchema } = require('../helpersdb/validation_schema');
const {signAccessToken, signRefresToken,verifyRefreshToken} = require('../helpersdb/jwt_helpers');
const { verify } = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res, next) =>{

    // const {email, password } = req.body;
    // try{
    //  if(!email || !password) throw createErrors.BadRequest()
    //  const doesexist = await User.findOne({email : email})
    //  if(doesexist) throw createErrors.Conflict(`${email} is already been registered...`)
    //  const user = new User({email, password})
    //  const savedUser = await user.save();
    //  res.send(savedUser)

    // } catch (error ){ 
    //       next(error)
    // }
// second method with JOI VALIDATION 

try {
    const result  = await authSchema.validateAsync(req.body);
    const doesexist = await User.findOne({email : result.email});
    if(doesexist)
          throw createErrors.Conflict(`${result.email} is been already registered...`)

        const user = new User(result)
        const userSaved = await user.save()
        const accessToken = await signAccessToken(userSaved.id)
        const refreshToken = await signRefresToken(userSaved.id)
        res.send({ accessToken ,refreshToken })
  
    
} catch (error) {
    if(error.isJoi === true) error.status = 422
    next(error)
    }

});





router.post('/login', async (req, res, next) =>{

    try {
        const result  = await authSchema.validateAsync(req.body)
         const user = await User.findOne({email : result.email })
         if(!user ) throw createErrors.NotFound('User not registered...')
        
       const isMatch = await user.isValidPassword(result.password)
       if(!isMatch) throw createErrors.Unauthorized("Username/Password is not valid.")
       const accessToken = await signAccessToken(user.id)
       const refreshToken = await signRefresToken(user.id)


         res.send({accessToken , refreshToken})
         
    } catch (error) {
        if(error.isJoi === true) return next(createErrors.BadRequest("invalid username/password...")) 
        next(error)
        
    }

    
});




router.post('/refresh-token', async (req, res, next) =>{
    try {
        const { refreshToken } = req.body
        if(!refreshToken) throw createErrors.BadRequest()
        const userId =   await verifyRefreshToken(refreshToken)
        const accessToken = await signAccessToken(userId)
        const refreshTokenn = await signRefresToken(userId)

        res.send({accessToken : accessToken,refreshToken:refreshTokenn })


        
    } catch (error) {
        next(error)
    }
     
    res.send('refresh-token router...')
});

router.delete('/logout', async (req, res, next) =>{

    res.send('logout router')

});




module.exports = router;