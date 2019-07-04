var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    userId: {type: String, require: true},
    userName: {type: String, require: true},
    title: { type: String, require: true},
    description: {type: String, require: true},
    createdAt: {type: Date, default: Date.now},
    comments: [{
        content: { type: String},
        commentatorId: { type: String },
        commentatorName: { type: String },
        commentedAt: {type: Date, default: Date.now},
      }],
});

module.exports = mongoose.model('Post',postSchema);
