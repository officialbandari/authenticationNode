const express = require('express');
const createErrors = require('http-errors');
const User  = require('../models/User.model');
const {authSchema } = require('../helpersdb/validation_schema');

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
        res.send(userSaved)
  

    
} catch (error) {
    if(error.isJoi === true) error.status = 422
    next(error)
    
}

});

router.post('/login', async (req, res, next) =>{
    res.send('login routes....');
});

router.post('/refresh-token', async (req, res, next) =>{

    res.send('refresh-token router...')
});

router.delete('/logout', async (req, res, next) =>{

    res.send('logout router')

});




module.exports = router;