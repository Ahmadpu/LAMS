const mongoose = require('mongoose');

const CaseRequestSchema = mongoose.Schema({
    case_type: {type: String, default: ''},
    case_city : {type : String, default : ''},

    lawyer_id : {type: String, default: ''},
    user : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
}, {timestamps: true});

module.exports = mongoose.model('CaseRequest', CaseRequestSchema);