const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
   blogimage: {type : String , default: " "},
   title : {type : String, default: " "},
   description : {type:String,default: " "},
   tag : {type: String,default:" "},
   _id : mongoose.Schema.Types.ObjectId ,
})
module.exports = mongoose.model("Blog",blogSchema);