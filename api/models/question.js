const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');

// Question Schema
const QuestionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [
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
      },
      {
        type: String,
        required: true
      }
  ],

  answer : {
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  topic:{
    type: String,
    required: true
  }
});

const Question = module.exports = mongoose.model('Question', QuestionSchema,'question');

function question_data(id, question, option1, option2, option3, option4, cat,topic) {
  this.id = id;
  this.question = question;
  this.option1 = option1;
  this.option2 = option2;
  this.option3 = option3;
  this.option4 = option4;
  this.cat = cat;
  this.topic = topic;
}

module.exports.getQuestionById = function(id, callback){
    Question.findById(id, callback);
}

//finding email
module.exports.getQuestion = function(callback){
  //const query = {category:question.category,topic:question.topic};
}

//adding user to database
module.exports.addQuestion = function(newQuestion, callback){
    newQuestion.save(callback);
}

module.exports.Question = function(aname,newpass, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newpass, salt, (err, hash) => {
      if(err) console.log(err);
     var myquery = { admin_name: aname };
     var newvalues ={ $set: { password: hash }};
       Admin.updateOne(myquery, newvalues, callback);
    });
  });
}

module.exports.compareQuestionAns = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}