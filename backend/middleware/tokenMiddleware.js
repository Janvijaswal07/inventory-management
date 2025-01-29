const mongoose  = require("mongoose")
const tokenSchema =  mongoose.Schema({
    userId :{
        type: mongoose.Schema.ObjectId
    }
})
const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;