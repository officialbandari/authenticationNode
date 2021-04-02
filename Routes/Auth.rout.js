const express = require('express');
const createErrors = require('http-errors');
const User  = require('../models/User.model')

const router = express.Router();

router.post('/register', async (req, res, next) =>{

    const {email, password } = req.body;
    try{
     if(!email || !password) throw createErrors.BadRequest()
     const doesexist = await User.findOne({email : email})
     if(doesexist) throw createErrors.Conflict(`${email} is already been registered...`)
     const user = new User({email, password})
     const savedUser = await user.save();
     res.send(savedUser)

    } catch (error ){ 
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