const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../../config/database');
const Admin = require('../../models/admin');

Admin:Object;

// Register
router.post('/register', (req, res, next) => {
  let newAdmin = new Admin({
    admin_name: req.body.name,
    password: req.body.password
  });
  Admin.addAdmin(newAdmin, (err, Admin) => {
    if(err){
        console.log(err);
      res.json({success: false, msg:'Failed to Add Admin'});
    } else {
      res.json({success: true, msg:'Admin added !'});
    }
  });
  
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const admin_name = req.body.aname;
  const password = req.body.password;

  Admin.getAdminByName(admin_name, (err, admin) => {
    if(err)   return res.json({success: false, msg: 'eeeSome Error Occured !'});
    if(!admin){
      return res.json({success: false, msg: 'Input valid credencials'});
    }
    Admin.compareAdminPassword(password, admin.password, (err, isMatch) => {
      if(err){
        return res.json({success: false, msg: 'Some Error Occured !'});
      }  
      if(isMatch){
        const token = jwt.sign (admin.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          admin: {
            id: admin._id,
            name: admin.admin_name
          }
        });
      } else {
        return res.json({success: false, msg: 'Invalid credentials'});
      }
    });
  });
});
// Change Password
router.post('/changepass', (req, res, next) => {
  let oldpass = req.body.oldpass ;
  let newpass = req.body.newpass 
  let Adminname = req.body.Adminname;
 
  Admin.getAdminByAdminname(Adminname, (err, Admin) => {
    if(err)   return res.json({success: false, msg: 'Some Error Occured !'});
    if(!Admin){
      return res.json({success: false, msg: 'Admin not found'});
    }
    Admin.compareAdminPassword(oldpass, Admin.password, (err, isMatch) => {
      if(err)  
        return res.json({success: false, msg: 'Some Error Occured !'});
         if(isMatch){
            Admin.updatePass(Admin.Adminname,newpass, (err,Admin) => {
            if(err){
               res.json({success: false, msg:'Failed to update password'});
          } else {
               res.json({success: true, msg:'Password Changed '});
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password !'});
      }
    });
  });
  });

  //password reset route
  router.post('/resetpass',(req,res,next) =>{
    Admin.getAdminEmail(req.body.email,(err,Admin)=>{
      if(err)   return res.json({success: false, msg: 'Some Error Occured !'});
      else{
        if(Admin){
          return res.json({success: true, msg: 'hai !'});
        }
        else{
          return res.json({success: false, msg: 'nahi hai!'});
        }
      }
    });
  });
// Profile
router.get('/profile', (req, res, next) => {
  res.json({Admin:req.Admin});
});

router.post('/:id'),(req,res,next)=>{
  res.json({})
}

module.exports = router;