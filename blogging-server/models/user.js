var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    userName: {type:String, require:true, unique: true},
    firstName:{type:String, require:true},
    lastName:{type:String, require:true},
    email : {type:String, require:true},
    password:{type:String, require:true}
});

userSchema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

userSchema.methods.isValid = function(hashedpassword){
    return  bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User',userSchema);