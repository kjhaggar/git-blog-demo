var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    userName: { type: String, require: true, unique: true, lowercase: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email : { type: String, require: true, lowercase: true},
    password: { type: String, require: true},
    image: { type: String },
    friends: [{
        friendName: {
            type: String, required: true,
            ref: 'User'
        },
        friendId: {
            type: Schema.ObjectId
        }
    }],
    provider: { type: String },
    provider_id: { type: String },
    provider_pic: { type: String },
    token: { type: String }
});

userSchema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

userSchema.methods.isValid = function(hashedpassword){
    return  bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User',userSchema);