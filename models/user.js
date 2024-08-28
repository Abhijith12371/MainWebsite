const mongoose = require('mongoose');
const PassportLocalMongoose=require("passport-local-mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/logintest')
  .then(() => console.log('Connected!'));


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