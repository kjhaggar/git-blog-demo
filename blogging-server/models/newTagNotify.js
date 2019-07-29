var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newTagNotifySchema = new Schema({
    postId: { type: Schema.ObjectId},
    taggedBy: {type: String},
    taggedUsers: [{
       userName: {type: String},
       read: {type: Boolean, default: false}
    }],
    time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Notification', newTagNotifySchema);