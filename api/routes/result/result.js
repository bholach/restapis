const express = require('express');
const router = express.Router();
const config = require('../../../config/database');
const Result = require('../../models/result');
Result:Object;
// Result 

router.post('/addResult', (req, res, next) => {
  let newResult = new Result ({
    examname : req.body.examname ,
     details : req.body.details
  });

  Result.findExam({examname:newResult.examname},{$push:{details:newResult.details}},(err,data)=>{

                if(err) res.json({success: false, msg:'some error occured '+err});
                else { if(data){ res.json({success: true, msg:'Result Updated Successfully !'});}
                else{ 
                    Result.addResult(newResult,(err,data)=>{
                        if(err) res.json({success: false, msg:'some error occured '+err});
                        else{
                            if(data) res.json({success: true, msg:'Result added Successfully !'});
                            else res.json({success: false, msg:'Failed to add result !'});
                        }
                    });
                    
                 }
                }
              });
});
//update Result
router.post('/updatecat', (req, res, next) => {

  Result.updateOne({Result:req.body.oldCat},{$set:{Result:req.body.newCat}},(err,data)=>{
    if(err){
      res.json({success: false, msg:'Some Error Occured'});
    }
      else{
        if(data.nModified){
          res.json({success: true, msg:'updated Successfully'});
        }
        else{
         res.json({success: false, msg:'Failed to update Result'});
        }
      }
  });

});
//delete  Result
router.post('/deleteresult', (req, res, next) => {

  let info = {
    examname:req.body.examname,
    id:req.body.id
}
Result.updateOne({examname:req.body.examname},{$pull:{details:{_id:info.id}}},(err,data)=>{
    if(err){
      res.json({success: false, msg:'Some Error Occured'});
    }
      else{
        if(data.nModified){
          res.json({success: true, msg:'Deleted Successfully'});
        }
        else{
         res.json({success: false, msg:'Failed to Delete Result'});
        }
      }
  });

});

router.post('/getresults',(req,res,next) => {
  
    Result.find({},{details:1},function(err,datas){
      if(err){ return res.json({success:false,msg:"some error ocuured !"});}
      else{ 
          if(datas[0]){
            res.json({success:true,details:datas[0].details});
          }
          else{
              res.json({success:false,msg:"failed to retrieve results"});
          }
      }
    });
  });
 
  
router.get('/getuserresult',(req,res,next) => {
  
  Result.find({},{},function(err,datas){
    if(err){ return res.json({success:false,msg:"some error ocuured !"});}
    else{ 
        if(datas){
          res.json({success:true,details:datas});
        }
        else{
            res.json({success:false,msg:"failed to retrieve results"});
        }
    }
  });
});

  
module.exports = router;