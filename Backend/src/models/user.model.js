const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required for creating a new user"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address'],
        unique:[true,"Email already exists"]
    },

    name:{
        type: String,
        required:[true,"Name is required for creating account"]
    },

    password:{
        type:String,
        required:[true,"Strong Password is required "],
        minlength: [6,"password should be more than 6 chars"],
        select:false //wont be returned as an query
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
},  {
    timestamps:true
})

userSchema.pre("save",async function(){ // normal fn used bcz this is used 
    //not changed skip!
    if(!this.isModified("password")) {
        return 
    }
    //changed convert ot hash
    const hash=await bcrypt.hash(this.password, 10)
    this.password =hash


    return 
})


userSchema.methods.comparePassword=async function(password){

    return await bcrypt.compare(password,this.password)

}

const userModel=mongoose.model("user",userSchema)

module.exports=userModel