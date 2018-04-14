const user = require('../models/user');
module.exports.createUser = function(newUser,callback){
    user.create(newUser,callback);
}