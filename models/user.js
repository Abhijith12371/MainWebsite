const mongoose = require('mongoose');
const PassportLocalMongoose=require("passport-local-mongoose")


mongoose.connect('mongodb://127.0.0.1:27017/logintest', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

let userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
    }
})

userSchema.plugin(PassportLocalMongoose);

module.exports=mongoose.model("user",userSchema)