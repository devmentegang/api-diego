var express = require('express');
var router = express.Router();
const {jsonResponse} = require('../lib/jsonresponse');
const createError = require('http-errors');

const Customer = require('../model/customers.model');



router.get('/',async (req,res,next)=>{
  let results ={};
  try{
    results = await Customer.find({},
      'company, document_type, document_number,fist_name,last_name, country');
  }catch(ex){
    next(createError(500,'Error fetching the customers'));
  }
  res.json(jsonResponse(200,{
    results
  }));

});


// router.post('/',async (req,res,next)=>{
//   const {company, document_type, document_number,fist_name,last_name, country} = req.body;
//   if(!company || !document_type || !document_number || !fist_name || !last_name || !country){
//     next(createError(400,'Error registering the customer. Please, provide all the information.'))
//   }else if(document_number && fist_name){
//     try{
//       const customer = new Customer({company, document_type, document_number,fist_name,last_name, country});
//       await customer.save()
//     }catch(ex){
//       next()
//     }

//   }
// });

router.get('/:idcustomer',(req,res,next)=>{
  
});


router.patch('/:idcustomer',(req,res,next)=>{
  
});

router.delete('/:idcustomer',(req,res,next)=>{
  
});