const express = require('express');
const morgan = require('morgan');
const creatError = require('http-errors');
const AuthRoute = require('./Routes/Auth.rout')
const {verifyAccessToken} = require('./helpersdb/jwt_helpers')
const client = require('./helpersdb/init_redis')
require('dotenv').config()
require('./helpersdb/mongodb')

client.SET("name", "krishna")
client.GET('name', (err, value)=>{
    if(err) console.log(err.message)
    console.log(value)
})

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))

const PORT = 9000;;


app.get('/', verifyAccessToken, async (req, res, next) =>{

    res.send('Hello the Auth application');
});

app.use('/auth', AuthRoute); 

app.use(async(req,res,next) =>{
    // const error = new Error('Not found')
    // error.status = 404
    // next(error)

    next(creatError.NotFound())
});

app.use((err,req,res,next) =>{
    res.status(err.status || 500,)
    res.send({
        error : {
            status : err.status || 500,
            message : err.message
        },
    })


});

app.listen(PORT, () =>{
    console.log(`The server is running :http://localhost:${PORT}`);
});

