const JWT = require('jsonwebtoken')
const createError = require('http-errors')



module.exports = {

    signaccessToken : (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload  = {}
            const secrete = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn : '30s',
                issuer :'bandari.com',
                audience : userId,
                  }

            JWT.sign(payload, secrete , options , (err, token) =>{

                if (err) {

                    //console.log(err.message)
                    //reject(err)
                    reject(createError.InternalServerError())
                }
               
                resolve(token)
            })

        }) 

    },


    verifyAccessToken : (req,res,next) =>{
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err , payload) =>{
            if(err){
                // if(err.name === 'JsonWebTokenError'){
                //     return next(createError.Unauthorized())
                // }else{
                //     return next(createError.Unauthorized(err.message))
                // }
                //ternary operator method
                const message = err.name === 'JsonWebTokenError' ? 'unauthorized' : err.message
                return next(createError.Unauthorized(message))
            
            }
            req.payload = payload
            next()
        })
    },


    signRefresToken : (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload  = {}
            const secrete = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn : '1y',
                issuer :'bandari.com',
                audience : userId,
                  }

            JWT.sign(payload, secrete , options , (err, token) =>{

                if (err) {

                    //console.log(err.message)
                    //reject(err)
                    reject(createError.InternalServerError())
                }
               
                resolve(token)
            })

        }) 

    },



} 
