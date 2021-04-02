const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({

    email :{
        type : String,
        required :true,
        lowercase : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    }
})


const User = mongoose.model('user', UserSchema)

module.exports = User