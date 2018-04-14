const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');

// Result Schema
const ResultSchema = mongoose.Schema({
    examname :{type:String,required : true},
    details : [
     {
        
         username: {type: String,required : true},
         score :{type:Number,required: true},
         Tscore :{type:Number,required: true}
     }
  ]
});

const Result = module.exports = mongoose.model('Result', ResultSchema,'Result');

module.exports.getResultById = function(id, callback){
    Result.findById(id, callback);
}

module.exports.getResultByExamName = function(newResult,examname, callback){
  const query = {examname: examname};
  const upq = {$push:{details:newResult.details}};
  Result.findOne(query,upq,callback);
}

//adding user to database
module.exports.addResult = function(newResult, callback){
         newResult.save(callback);
}
//find user
module.exports.findExam= function(userName,update ,callback){
    
    Result.findOneAndUpdate(userName,update,callback);
}



