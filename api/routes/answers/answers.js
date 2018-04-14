const express = require('express');
const router = express.Router();
const config = require('../../../config/database');
const Answers = require('../../models/answers');
Answers:Object;


router.post('/addanswers', (req, res, next) => {
  let newAnswers = new Answers ({
    username: req.body.username,
    answers : req.body.answers
  });
  Answers.findOne({username:newAnswers.username},(err,data)=>{
    if(data)
       res.json({success:false,msg:"anser already exist"});
    else{
        Answers.addAnsers(newAnswers,(err,data) => {
        if(err){
          res.json({success: false, msg:'Failed to add Ansers'});
        } 
        else {
          res.json({success: true, data:data});
        }
      });
    }
  });
 
});

router.post('/updateanswer', (req, res, next) => {
    let newAnswer = new Answers ({
      username: req.body.username,
      answers : req.body.answers
    });
    Answers.updateAnswer(newAnswer, (err, data) => {
      if(err){
        res.json({success: false, msg:'Failed to Upadte answer'+err});
      } 
      else if(data.nModified){
        res.json({success: true, msg:'Upadte answer Successfully !'+data.answers});
      }
      else {
        res.json({success: true, msg:"Failed to Upadte answer"});
      }
    });
  });


  router.post('/getanswers',(req,res,next) => {
    let newAnswer= new Answers ({
        username: req.body.username
      });
    Exam.findExamQuestion(newAnswer,function(err,datas){
    
      if(err){ return {success:false,msg:"some error ocuured !"};}
      if(datas == null || datas.questions <= 0) {return {success:false,msg:"some error ocuured !"};}
      else{ 
        res.json({success:true,data:datas.questions});
      }
    });
  });


//getting number of question of particular category
router.post('/examquesstat',(req,res,next) => {

  let newExam = new Exam ({
    examname: req.body.examname
  });
  console.log(newExam.examname);
  Exam.findOne({examname:newExam.examname},{questions:1},function(err,datas){
    if(err){ return {success:false,msg:"some error ocuured !"};}
    if(!datas){ return {success:false,msg:"some error ocuured !"};}
    else{ 
      data = categoryCount(datas.questions);
      res.json({success:true,data:data});
    }
  });
});

module.exports = router;