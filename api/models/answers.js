const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');

// Exam Schema
const AnswerSchema = mongoose.Schema({
  username: {
    type: String,
    required : true
  },
  answers : [{
    qno:Number,
    no:Number, 
    opt:Number,
    status:String
     }]
});

const Answers = module.exports = mongoose.model('Answers', AnswerSchema,'Ansers');

module.exports.getAnswerById = function(id, callback){
    Answers.findById(id, callback);
}

module.exports.findAnswer = function(examName, callback){
  const query = {username: AnswerName.answername};
  Answers.findOne(query, callback);
}

//adding user to database
module.exports.addAnsers = function(newAnswer, callback){
         newAnswer.save(callback);
}

//adding Topics to Exam
module.exports.addNewAnswer = function(newAnswer, callback){
  var myquery = {username: newAnswer.username};
  var newvalues ={$push: {answers : newAnswer.answers}};
  Answers.updateOne(myquery, newvalues, callback);
  }

  module.exports.updateAnswer = function(newAnswer, callback){
    var myquery = {username: newAnswer.username,"answers.qno":newAnswer.answers[0].qno};
    var newvalues ={$set: 
        { answers:newAnswer.answers[0]  },
        
    };
    Answers.updateOne(myquery, newvalues,callback);
    }
  

