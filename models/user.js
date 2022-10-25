const mongoose = require('mongoose')
const { Schema } = mongoose
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
  };
const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
    },
    birthDate :{
        type: Date,
        
    },address :{
        type: String,
        
    },
    pin:{
        type:String,
        max: 4
    }
    
    
  
},{ timestamps: true })

module.exports = mongoose.model('user', userSchema)