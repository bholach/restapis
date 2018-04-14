const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');

// Category Schema
const CategorySchema = mongoose.Schema({
  category: {
    type: String,
    required : true
  },
  topics : [
      {name : String}
  ]
});

const Category = module.exports = mongoose.model('Category', CategorySchema,'category');

module.exports.getCategoryById = function(id, callback){
    Category.findById(id, callback);
}

module.exports.getCategoryByUsername = function(username, callback){
  const query = {username: username};
  Category.findOne(query, callback);
}

//adding user to database
module.exports.addCategory = function(newCat, callback){
         newCat.save(callback);
}



