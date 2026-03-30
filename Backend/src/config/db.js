const mongoose=require("mongoose")


function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server is connected!")
    })
    .catch(err => {
    console.log("Error connecting to db:", err.message)
    process.exit(1)
    })
}

module.exports=connectToDB