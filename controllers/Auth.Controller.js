const User = require("../models/User.model")
const { signAccessToken, signRefresToken, verifyRefreshToken} = require("../helpersdb/jwt_helpers")
const { authSchema } = require("../helpersdb/validation_schema")
const client = require("../helpersdb/init_redis")
const createError  = require('http-errors')

module.exports = {


    register : async (req, res, next) =>{

        try {
            const result = await authSchema.validateAsync(req.body)
            const doesExist = await User.findOne({email: result.email})
            if (doesExist) throw createError.Conflict(`${result.email} is already been registered`)
            
            const user = new User(result)
            const savedUser = await user.save()
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken = await signRefresToken(savedUser.id)
            res.send({accessToken, refreshToken})


        } catch (error) {
          if(error.isJoi === true) error.status = 422
          next(error)
         
        }

 },




   login : async (req, res, next) =>{

      try {
        const result = authSchema.validateAsync(req.body)
        const user  = await User.findOne({email: result.email})
        if(!user) throw createError.NotFound('User not registered')
        
        const isMatch = await user.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized('Username/Password not valid...')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefresToken(user.id)

        res.send({accessToken, refreshToken})

      } catch (error) {
          if(error.isJoi === true)
          return next(createError.BadRequest(' Invalid Username/Password '))
          next(error)
          
      }

},




refreshToken : async (req, res, next) =>{

    try {
        
        const {refreshToken } = req.body
        if(!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refToken = await signRefresToken(userId)

        res.send({accessToken : accessToken, refreshToken : refToken })

    } catch (error) {

        next(error)
        
    }

},


logout : async (req, res, next ) =>{

    try {
        
   const {refreshToken} = req.body

   if(!refreshToken) throw createError.BadRequest()
   const userId = await verifyRefreshToken(refreshToken)
   client.DEL(userId , (err , val ) =>{

    if(err){
        console.log(err.message)
        throw createError.internalServerError()
    }
    console.log(val)
    res.sendStatus(204)

 })

 } catch (error) {

    next(error)
        
    }
}



}