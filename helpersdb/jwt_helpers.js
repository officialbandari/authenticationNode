const JWT = require('jsonwebtoken')
const createError = require('http-errors')



module.exports = {
    signaccessToken : (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload  = {}
            const secrete = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn : '1h',
                issuer :'pickurpage.com',
                audience : userId,
                  }

            JWT.sign(payload, secrete , options , (err, token) =>{

                if (err) {

                    console.log(err.message)
                    //reject(err)
                    reject(createError.InternalServerError())
                }
               
                resolve(token)
            })

        }) 

    },
} 
