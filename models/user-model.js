const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
  google: {type: String, default: ''},
  
  facebook: {type: String, default: ''},
  fbTokens: {type: Array},
  
  profilePhoto: {type: String, default: ''},
  contact_number: {type: String, default: ''},
  
  fullname : {type : String, default : ''},
  father_name: {type: String, default: ''},
  
  cases: [{type: String}],
	
  email : {type : String, unique : true, required: true},
  password : {type : String, default : ''},
	
  
  resetPasswordToken: {type: String, required: false},
  resetPasswordExpires: {type: Date, required: false}
}, {timestamps: true});

UserSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = mongoose.model('User', UserSchema);
