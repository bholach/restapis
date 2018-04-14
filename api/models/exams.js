const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');

// Exam Schema
const ExamSchema = mongoose.Schema({
  examname: {
    type: String,
    required : true
  },
  questions : [{
    question:{type: String},
      options :[ {
        type: String,
        required: true
      },
      {
        type: String,
        required: true
      },
      {
        type: String,
        required: true
      },
      {
        type: String,
        required: true
      }],
    answer:  {type:String,required: true},
    category: {type:String,required: true}
  }]
});

const Exam = module.exports = mongoose.model('Exam', ExamSchema,'Exam');

module.exports.getExamById = function(id, callback){
    Exam.findById(id, callback);
}

module.exports.findExamQuestion = function(examName, callback){
  const query = {examname: examName.examname};
  Exam.findOne(query, callback);
}

module.exports.UpdateExam = function(newExam,callback){
  const query = {examname:newExam.oldExamName}
  const queryup = {$set:{examname:newExam.newExamName}}
  Exam.updateOne(query,queryup,callback);
}
//updating qestion
module.exports.UpdateQues = function(newQues,id,callback){
 
        const query = {examname:newQues.examname,questions:{_id:id}}
        const queryup = {$set:{questions:{
          question : newQues.examanme,
          answer : 2666
        }}}
        Exam.updateOne(query,queryup,callback);
}
//adding exam to database
module.exports.addExam = function(newExam, callback){
         newExam.save(callback);
}

//adding questiob to Exam
module.exports.addQuestion = function(newQuestion, callback){
  var myquery = {examname: newQuestion.examname};
  var newvalues ={$push: {questions : newQuestion.questions}};
  Exam.updateOne(myquery, newvalues, callback);
  }


