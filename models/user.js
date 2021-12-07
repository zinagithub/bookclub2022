const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    
    sub: {
        type: String,
        required: true
    },
    createdAt: {
        type : Date,
        default: Date.now
    }  
     
});
let User = mongoose.model('User', userSchema, 'users');
module.exports = User  