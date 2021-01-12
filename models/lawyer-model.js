const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');
const crypto = require('crypto');

const LawyerSchema = mongoose.Schema({
  profilePhoto: {type: String, default: ''},
  first_name : {type : String, default : ''},
  last_name : {type : String, default : ''},
  cnic: {type: String, default:''},
  contact_number: {type: String, default: ''},
  email : {type : String, unique : true, required: true},
  address: {type: String, default: ''},
  password: {type: String, default: ''},
  cases:{type:Array ,default: []},
  resetPasswordToken: {type: String, required: false},
  resetPasswordExpires: {type: Date, required: false}

}, {timestamps: true});

LawyerSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

LawyerSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

LawyerSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = mongoose.model('Lawyer', LawyerSchema);
