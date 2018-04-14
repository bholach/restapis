const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../../config/database');
const User = require('../../models/user');

user:Object;
// Register
router.post('/register', (req, res, next) => {
   let name = req.body.fname+' '+req.body.lname;
  let newUser = new User({
    name: name,
    email: req.body.email,
    password: req.body.password,
    gender:req.body.gender,
    fathername: req.body.father,
    dob:req.body.dob,

    qualification:req.body.degree,
    board:req.body.boru,
    collagename:req.body.collage,
    collagecity:req.body.collagecity,
    collagepin:req.body.collagepin,
    percentage:req.body.percantage,

    address:req.body.address,
    landmark:req.body.lmark,
    state:req.body.state,
    city:req.body.city,
    pin:req.body.pin,
    mobile:req.body.mobile,
    regnum: regnum(req.body.fname,req.body.dob)
  });

  User.getUserByEmail(newUser.email,(err,data)=>{
    if(err){ res.json({success: false, msg:'Some Error Occured'});}
    else if(!data){
      User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, msg:'Failed to register user'});
        } else {
          res.json({success: true, msg:'User registered',regnum:user.regnum});
        }
      });
    }
    else res.json({success: false, msg:'Email Already Registred'});
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.getUserByEmail(email, (err, user) => {
    if(err)   return res.json({success: false, msg: 'Some Error Occured !'});
    if(!user){
      return res.json({success: false, msg: 'Email or Password is Wrong'});
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err)  return res.json({success: false, msg: 'Some Error Occured !'});
      if(isMatch){
        const token = jwt.sign (user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            gender:user.gender,
            exam:user.exam,
            dob:user.dob
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong email or password'});
      }
    });
  });
});
// Change Password
router.post('/changepass', (req, res, next) => {
  let oldpass = req.body.oldpass ;
  let newpass = req.body.newpass 
  let username = req.body.username;
 
  User.getUserByUsername(username, (err, user) => {
    if(err)   return res.json({success: false, msg: 'Some Error Occured !'});
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.comparePassword(oldpass, user.password, (err, isMatch) => {
      if(err)  
        return res.json({success: false, msg: 'Some Error Occured !'});
         if(isMatch){
            User.updatePass(user.username,newpass, (err,user) => {
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
    User.getUserByEmail(req.body.email,(err,user)=>{
      if(err) return res.json({success: false, msg: 'Some Error Occured !'});
      else{
        if(user){
          User.sendMail(user,(err,info)=>{
            if(err){
              return res.json({success: false, msg: 'Failed to send Email !'});
            }
            else{
              return res.json({success: true, msg: 'Password Reset link has been send to your email address.Please check your mail.'});
            }
          })
        }
        else{
          return res.json({success: false, msg: 'No account linked with this email'});
        }
      }
    });
  });

  //send user query
  router.post('/senquery',(req,res,next) =>{
    let user = {
      name:req.body.name,
      email:req.body.email,
      query:req.body.query
    }
    User.sendRequest(user,(err,data) =>{
       if(err){
        return res.json({success: false, msg: 'some error occured'});
       }
       else{
        return res.json({success: true, msg: 'Request has been submitted successfully'});
       }
    }); 
  });
// get users
router.get('/alluser', (req, res, next) => {
 var usersData=[];
  User.getAllUsers((err,users)=>{
    if(err) return res.json({success: false, msg: 'Some Error Occured !'});
   
    else{
      if(users){
        users.forEach(data => {
          usersData.push({
            name:data.name,
            email:data.email,
            gender:data.gender,
            age:data.age,
            exam:data.exam,
            regnum:data.regnum,
            dob:data.dob
          });
        });
        res.json({success: true, users: usersData});
      }
      else{ return res.json({success: false, msg: 'No user found'});}
    }
  });
});

// Delete user
router.get('/deluser', (req, res, next) => {
  let user = {
    id : req.body.userid
  }
  User.remove({_id:user.id},(err,data)=>{
    if(err){ res.json({success:false , msg:'some error occured'});}
    else{
      if(data){
        res.json({success:true , msg:'deleted'});
      }
      else res.json({success:false , msg:'failed to delete account'});
    }
  });
  res.json({user:req.user});
});

// Profile
router.get('/profile', (req, res, next) => {
  res.json({user:req.user});
});

router.post('/:id'),(req,res,next)=>{
  res.json({})
}
//email verify
router.get('/everifykey:everifykey?', (req, res, next) => {
//res.send(req.params.everifykey);
 //res.json({user:req.user});
 res.redirect('http://localhost:4200/login');

});

var regnum = function(name,dob){
  let pre = dob[0]+dob[1];
  let pre2 = dob[2]+dob[3];
  let mid = dob[5]+dob[6];
  let last = dob[8]+dob[9];
  let str = name[1].toUpperCase()+mid+name[2].toUpperCase()+last+name[0].toUpperCase()+pre+name[3].toUpperCase()+pre2;
  //return str.replace(/\s-/gi,"");
  return str;
}

module.exports = router;