var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newTagNotifySchema = new Schema({
    typeOfMsg: {type: String},
    postId: { type: Schema.ObjectId},
    taggedBy: {
        name: {type: String},
        id: {type: String}
    },
    taggedUsers: [{
       userName: {type: String},
       read: {type: Boolean, default: false}
    }],
    userId: {type: String},
    userName: {type: String},
    friendId: {type: String},
    friendName: {type: String},
    time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Notification', newTagNotifySchema);