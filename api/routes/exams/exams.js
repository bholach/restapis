const express = require('express');
const router = express.Router();
const config = require('../../../config/database');
const Exam = require('../../models/exams');
Exam:Object;
// Exam 
const availCategory = ["aptitute","resoning","english","genralawareness"];

router.post('/addexam', (req, res, next) => {
  let newExam = new Exam ({
    examname: req.body.examname
  });
  Exam.findOne({examname:newExam.examname},(err,data)=>{
    if(data)
      res.json({success:false,msg:"exam already exist"});
    else{
      Exam.addExam(newExam,(err, data) => {
        if(err){
          res.json({success: false, msg:'Failed to add Exam'});
        } 
        else {
          res.json({success: true, msg:'Exam added successfully !'});
        }
      });
    }
  });
 
});

//update exams name
router.post('/updateexam', (req, res, next) => {
  let newExam={
    oldExamName : req.body.oldExamName,
    newExamName : req.body.newExamName
  }
  Exam.UpdateExam(newExam,(err,data)=>{
    if(err){
      res.json({success: false, msg:'Some Error Occured'});
    }
      else{
        if(data.nModified){
          res.json({success: true, msg:'updated Successfully'});
        }
        else{
         res.json({success: false, msg:'Failed to update exam name'});
        }
      }
  });
 
});
//deleting exams
router.post('/deleteexam', (req, res, next) => {
  let newExam = new Exam ({
    examname: req.body.examname
  });
  Exam.findOne({examname:newExam.examname},(err,data)=>{
    if(data)
      {
        Exam.findByIdAndRemove({_id: data._id},(err,data)=>{
          if(err){
            res.json({success: false, msg:'Failed to delete exam'});
          } 
          else if(data)
            res.json({success:true,msg:"Exam deleted successfully"});
        });
      }
    else res.json({success:false,msg:"Exam Doesn't exist"});   
  });
 
});


router.post('/addquestion', (req, res, next) => {
    let newExam = new Exam ({
      examname: req.body.examname,
      questions : req.body.questions
    });
    Exam.addQuestion(newExam, (err, data) => {
      if(err){
        res.json({success: false, msg:'Failed to add Question'});
      } 
      else if(data.ok){
        res.json({success: true, msg:'Question was added Successfully !'});
      }
      else {
        res.json({success: true, msg:"failed to add question"});
      }
    });
  });
//update question
router.post('/updateQues', (req, res, next) => {
  let newQues = {
    examname : req.body.examname,
    questions : req.body.questions
  };
  Exam.UpdateQues(newQues,req.body.QID,(err,data)=>{
    if(err){
      res.json({success: false, msg:'Some Error Occured'});
    }
      else{
        if(data.nModified){
          res.json({success: true, msg:'updated Successfully'});
        }
        else{
         res.json({success: false, msg:'Failed to update Question'});
        }
      }
  });
});

//deleting Questions
router.post('/deletequestion', (req, res, next) => {
  let newExam = new Exam ({
    examname: req.body.examname
  });
  Exam.find({examname:newExam.examname},(err,data)=>{
    if(data)
      {
            Exam.update({examname:newExam.examname},{$pull:{questions:{_id:req.body.QID}}},(err,data)=>{
              if(err){
                res.json({success: false, msg:'Failed to delete question'+err});
              } 
              else if(data)
                res.json({success:true,msg:"Question deleted successfully"});
            });
  }
    else res.json({success:false,msg:"Question Doesn't exist"});   
  });
 
});


 router.get('/examnames',(req,res,next) => {
    Exam.find({},{examname:1},function(err,datas){
      if(err){ return {success:false,msg:"some error ocuured !"};}
      else{ 
        res.json({success:true,data:datas});
      }
    });
  });

  router.post('/getquestions',(req,res,next) => {
    let newExam = new Exam ({
        examname: req.body.examname
      });
    Exam.findExamQuestion(newExam,function(err,datas){
    
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
  Exam.findOne({examname:newExam.examname},{questions:1},function(err,datas){
    if(err){ return {success:false,msg:"some error ocuured !"};}
    if(!datas){ return {success:false,msg:"some error ocuured !"};}
    else{ 
      data = categoryCount(datas.questions);
      res.json({success:true,data:data});
    }
  });
});

function categoryCount(categories){
     let apticount=0,rescount=0,engcount=0,gencount=0;
      categories.forEach(cat=>{
        if(cat.category == availCategory[0]) apticount++;         
        else if(cat.category == availCategory[1]) rescount++;
        else if(cat.category == availCategory[2]) engcount++; 
        else if(cat.category == availCategory[3]) gencount++;    
      });

      return {
        aptitute:apticount,
        resoning:rescount,
        english:engcount,
        genral:gencount
      };
}
module.exports = router;