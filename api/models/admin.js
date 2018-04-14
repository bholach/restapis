const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');

// Admin Schema
const AdminSchema = mongoose.Schema({
  admin_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema,'admin');

module.exports.getAdminById = function(id, callback){
  Admin.findById(id, callback);
}

//finding email
module.exports.getAdminByName = function(aname,callback){
  const query = {admin_name:aname};
  Admin.findOne(query,callback);
}

//adding user to database
module.exports.addAdmin = function(newAdmin, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
      if(err) console.log(err);
      newAdmin.password = hash;
      newAdmin.save(callback);
    });
  });
}

module.exports.updatePass = function(aname,newpass, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newpass, salt, (err, hash) => {
      if(err) console.log(err);
     var myquery = { admin_name: aname };
     var newvalues ={ $set: { password: hash }};
       Admin.updateOne(myquery, newvalues, callback);
    });
  });
}

module.exports.compareAdminPassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}