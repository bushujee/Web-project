const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true   // usernames should be unique
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact:{
    type:Number,
    required: true
  },
   fee:{
    type: String,
    enum: ['paid','unpaid'],
    default: 'paid'
   },


  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
