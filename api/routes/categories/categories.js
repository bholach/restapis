const express = require('express');
const router = express.Router();
const config = require('../../../config/database');
const Category = require('../../models/categories');
Category:Object;
// Category 

router.post('/addcategory', (req, res, next) => {
  let newCategory = new Category ({
    category: req.body.category
  });
  Category.findOne({category:newCategory.category},(err,data)=>{
       if(data){
         res.json({success: false, msg:'Sorry! category already available'});
       }
       else{
        Category.addCategory(newCategory, (err, data) => {
          if(err){
            res.json({success: false, msg:'Failed to add Category'});
          } 
          else {
            res.json({success: true, msg:'Category added Successfully !'});
          }
        });
       }
  });

});
//remove category
router.post('/removecat', (req, res, next) => {
  let newCategory = new Category ({
    category: req.body.category
  });
  Category.remove({category:newCategory.category},(err,data)=>{
    if(err){
      res.json({success: false, msg:'Some Error Occured'});
    }
      else{
        if(data.n){
          res.json({success: true, msg:'Deleted Successfully'});
        }
        else{
         res.json({success: false, msg:'Failed to delete category'});
        }
      }
  });

});
//update category
router.post('/updatecat', (req, res, next) => {

  Category.updateOne({category:req.body.oldCat},{$set:{category:req.body.newCat}},(err,data)=>{
    if(err){
      res.json({success: false, msg:'Some Error Occured'});
    }
      else{
        if(data.nModified){
          res.json({success: true, msg:'updated Successfully'});
        }
        else{
         res.json({success: false, msg:'Failed to update category'});
        }
      }
  });

});

router.get('/getcategories',(req,res,next) => {
    Category.find({},{category:1},function(err,datas){
      if(err){ return {success:false,msg:"some error ocuured !"};}
      else{ 
        var cat = [];
        datas.forEach(element => {
          cat.push(element.category)
        });
        JSON.stringify(cat);
        res.json({
          success:true,
          categories : cat
        });
      }
    });
  });
 
  
module.exports = router;