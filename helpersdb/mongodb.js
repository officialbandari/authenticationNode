const mongoose = require('mongoose');

//||"mongodb://localhost:27017"

//||"auth_tutorial"

mongoose
.connect(process.env.MONGODB_URI||"mongodb://localhost:27017", 
   {
    dbName:process.env.DB_NAME||"auth_tutorial",
     useNewUrlParser: true,
     useUnifiedTopology: true ,
     useFindAndModify: false,
     useCreateIndex:true,

    })
.then(() => {
    console.log('db is connected...')
})
.catch((err) =>{
    console.log(err.message)
})

mongoose.connection.on('connected', ()=> {
    console.log('Mongodb is connected...')
})


mongoose.connection.on('error', (err)=> {
    console.log(err.message)
})


mongoose.connection.on('disconnected', ()=> {

    console.log('Mongoose connection is disconnected...')
})

process.on('SIGINT', async ()=>{

    await mongoose.connection.close()
    process.exit(0)
})