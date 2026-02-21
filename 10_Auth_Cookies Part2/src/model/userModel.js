const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 2,
        maxlength: 25,
    },
    email: {
        type: String,
        required: [true, "Email is reuired"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password is too small"],
    }
})

module.exports = mongoose.model("User", userSchema)