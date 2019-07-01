var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    userId: {type: String, require: true},
    userName: {type: String, require: true},
    createdAt: {type: Date, default: Date.now},
    content: { type: String, require: true}
});

module.exports = mongoose.model('Comment',commentSchema);