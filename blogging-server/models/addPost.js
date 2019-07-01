var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    userId: {type: String, require: true},
    userName: {type: String, require: true},
    createdAt: {type: Date, default: Date.now},
    title: { type: String, require: true},
    description: {type: String, require: true}
});

module.exports = mongoose.model('Post',postSchema);