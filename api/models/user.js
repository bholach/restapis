const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');
const nodemailer = require('nodemailer'); //mail agent 
const uname="uic.17mca1024@gmail.com";
const pass="tejaSh816";
// User Schema
const UserSchema = mongoose.Schema({
  name: {type: String ,required:true},
  fathername: { type: String,required:true },
  email: { type: String,required:true },
  password: { type: String,required: true},
  gender:{ type:String,required: true},
  dob:{type:String,required:true},
  qualification:{type:String,required: true},
  board:{type:String,required: true},
  collagename:{type:String,required: true},
  collagecity:{type:String,required: true},
  collagepin:{type:String,required: true},
  percentage:{type:String,required: true},
  address:{type:String,required: true},
  landmark:{type:String,required: true},
  state:{type:String,required: true},
  city:{type:String,required: true},
  pin:{type:String,required: true},
  mobile:{type:String,required: true},
  regnum:{type:String,required: true}
});

const User = module.exports = mongoose.model('User', UserSchema,'user');

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {name: username};
  User.findOne(query, callback);
}

module.exports.getAllUsers = function(callback){
  User.find(callback);
}
//finding email
module.exports.getUserByEmail = function(email,callback){
  const query = {email: email};
  User.findOne(query,callback);
}

//adding user to database
module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) console.log("ye wala"+err);
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.updatePass = function(username,newpass, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newpass, salt, (err, hash) => {
      if(err) console.log(err);
     var myquery = { username: username };
     var newvalues ={ $set: { password: hash }};
       User.updateOne(myquery, newvalues, callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}

//sending mail
module.exports.sendMail= function(user,callback){
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {user: uname, pass: pass}
});
// setup e-mail data
var mailOptions = {
  from: '"online Examination Portal " <oexam@oexam.com>', // sender address (who sends)
  to: user.email, // list of receivers (who receives)
  subject: 'Password reset link', // Subject line
  text: 'Password reset link', // plaintext body
  html: '<b>Hello '+user.name+'</b><br><br>click below button to reset your password<br><br><br><center><a href="http://localhost:4200/resetpass/'+user._id+'" style="color:white;padding:20px;border:none;background:#0bf;width:80px;height:40px;">Reset Link</a></center>' // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, callback);
}

//sending mail
module.exports.sendRequest = function(user,callback){
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {user: uname, pass: pass}
});
// setup e-mail data
var mailOptions = {
  from: '"online Examination Portal " <oexam@oexam.com>', // sender address (who sends)
  to: 'uic.17mca1024@gmail.com', // list of receivers (who receives)
  subject: 'Student Query', // Subject line
  text: 'Student Query', // plaintext body
  html: '<b>Name </b> : '+user.name+'<br><br><b>Email </b>: '+user.email+'<br><br><b>Query</b> : <p>'+user.query // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, callback);
}