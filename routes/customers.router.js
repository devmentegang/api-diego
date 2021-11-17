var express = require('express');
var router = express.Router();
const {jsonResponse} = require('../lib/jsonresponse');
const createError = require('http-errors');

const Customer = require('../model/customers.model');



router.get('/',async (req,res,next)=>{
  let results ={};
  try{
    results = await Customer.find({}, 'company document_type document_number fist_name last_name  country date_creation status');
    console.log(results);
  }catch(ex){
    next(createError(500,'Error fetching the customers'));
  }
  res.json(jsonResponse(200,{
    results
  }));

});


router.post('/',async (req,res,next)=>{
  const {company, document_type, document_number,fist_name,last_name, country} = req.body;
  let id_customer = null;
  if(!company || !document_type || !document_number || !fist_name || !last_name || !country){
    next(createError(400,'Error registering the customer. Please, provide all the information.'));
  }else if(document_number && fist_name){
    try{
      //const date_creation = date.getDate();
      const customer = new Customer({company, document_type, document_number,fist_name,last_name, country});
      id_customer = await customer.save();
 
    }catch(ex){
      next(createError(500,'Error tryng to register the product, try again.'));
    }
      res.json(jsonResponse(200,{
        message: `The customer has been added successfully ${id_customer._id}`,
        id_customer:`${id_customer._id}`
        
      }));
  }
});

router.get('/:id_customer',async (req,res,next)=>{
  let results;
  const {id_customer} = req.params;
  if(!id_customer){
    next(createError(400,'No document_number provided'));
  }
  try{
    results = await Customer.findById(id_customer,'company document_type document_number fist_name last_name country status date_creation');
  }catch(ex){
    next(createError(500,'Error trying to fetch a customer'));
  };

  res.json(results);

});


router.patch('/:id_customer', async (req,res,next)=>{
  let update = {};

  const {id_customer} = req.params;
  const {fist_name, last_name, country} = req.body;

  if(!id_customer){
    next(createError(400,'No id provided'));
  };

  if(!fist_name && !last_name && !country){
    next(createError(400,'No information avaliable to update'));
  };

  if(fist_name) update['fist_name'] = fist_name;
  if(last_name) update['last_name'] = last_name;
  if(country) update['country'] = country;

  try{
    await Customer.findByIdAndUpdate(id_customer,update);
  }catch(ex){
    next(createError(500,'Error trying to update a customer'));
  };

  res.json(jsonResponse(200,{
    message: `The customer ${id_customer} has been updated`

  }));  

});

router.delete('/:id_customer', async (req,res,next)=>{
  const {id_customer} = req.params;

  try{
    await Customer.findByIdAndDelete(id_customer);

  }catch(ex){
    next(createError(500,'Error trying to delete a customer'));

  };
  
  res.json(jsonResponse(200,{
    message: `The customer ${id_customer} has been deleted` 
  }));  

});



router.patch('/changestatus/:_id', async (req,res,next)=>{
  let update = {};

  const {_id} = req.params;
  const {status} = req.body;
  let results = {};

  if(!_id){
    next(createError(400,'No id provided'));
  };

  
  if(!status){
    next(createError(400,'No information avaliable to change status'));
  };

  // if(results==={}){
  //   next(createError(400,'Id does not exist'));
  // }

  if(status) update['status'] = status;


  try{
    //results = await Customer.findById(_id);
    results = await Customer.findByIdAndUpdate(_id,update);
    
  }catch(error){
    return next(createError(500,error));
    
  };


    res.json(jsonResponse(200,{
      message: `The customer ${_id} has changed to ${status}`,
      changes: results
    }));  
  

 

});



module.exports = router;