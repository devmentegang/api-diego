const Mongoose = require('mongoose');

const CustomerSchema = new Mongoose.Schema({
    company:{type:String,required:true},
    document_type:{type:String,required:true},
    document_number:{type:String,required:true},
    fist_name:{type:String,required:true},
    last_name:{type:String,required:true},
    country:{type:String,required:true}}
    );

module.exports = Mongoose.model('Customer',CustomerSchema);