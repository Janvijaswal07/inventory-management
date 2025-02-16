const mongoose  = require("mongoose")
const tokenSchema =  mongoose.Schema({
    userId :{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "user"
    },
    token :{
        type: String,
        required: true,
    },
   
    createdAT :{
        type: Date,
        required: true,
    },
   
    expriresAt :{
        type: Date,
        required: true,
    },
   
})
const Token = mongoose.model("Token", tokenSchema);
module.exports = Token