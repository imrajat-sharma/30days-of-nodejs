const mongoose = require("mongoose")
require("dotenv").config()

module.exports = {
    connectDB: async () => {
        try{
            await mongoose.connect(process.env.MONGODBURI)
            console.log("Mongodb connection sucessfull..")
        } catch(err) {
            console.error("Connection failed",err)
            process.exit(1)
        }
    }
}

