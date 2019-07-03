var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    userId: {type: String, require: true},
    userName: {type: String, require: true},
    title: { type: String, require: true},
    description: {type: String, require: true},
<<<<<<< HEAD
    createdAt: {type: Date, default: Date.now},
    comments: [{
        content: { type: String},
        commentatorId: { type: String },
        commentatorName: { type: String },
        commentedAt: {type: Date, default: Date.now},
      }]
=======
    comments: [{
        comment: { type: String},
        commentator: { type: String }
    }]
>>>>>>> fbb59d0498928c0910a849abb39c25e8dd3c14fb
});

module.exports = mongoose.model('Post',postSchema);
