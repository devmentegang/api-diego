const Mongoose = require('mongoose');

const CustomerSchema = new Mongoose.Schema({
    company:{type:String,required:true},
    document_type:{type:String,required:true},
    document_number:{type:String,required:true},
    fist_name:{type:String,required:true},
    last_name:{type:String,required:true},
    country:{type:String,required:true},
    date_creation:{type:Date,default:Date.now},
    status:{type:String,default:'Created'}
    }
    );


// CustomerSchema.methods.customeridExists = async function(_id){
//     try{
//     let result = await Mongoose.model('Customer').find({_id: _id});
//     return result.length = 1;
//     }catch(ex){
//         return false;
//     }
// };

// CustomerSchema.methods.customerExists = async function(id_customer){
//     let result = await Mongoose.model('Customer').find({id_customer: _id});
//     return result.length = 1;
// }


module.exports = Mongoose.model('Customer',CustomerSchema);