const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken: {
        type: String,
    }

})

module.exports = mongoose.model("User", userSchema)