const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

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
    },
    role: {
        type: String,
        enum: [{
            values: ["user", "admin"],
            message: "{VALUE} is not supported",
        }],
        default: "user",
    }
}, { timestamps: true })

userSchema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcryptjs.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function(userInputPassword) {
    return await bcryptjs.compare(userInputPassword, this.password);
}

module.exports = mongoose.model("User", userSchema)