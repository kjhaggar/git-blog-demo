var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = new Schema;
replySchema.add({
	commenterId: { type: String },
	commenterName: { type: String },
	content: { type: String},
	commentedAt: {type: Date, default: Date.now}
});

var postSchema = new Schema({
    userId: {type: String, require: true},
    userName: {type: String, require: true},
    title: { type: String, require: true},
    description: {type: String, require: true},
    createdAt: {type: Date, default: Date.now},
    imageUrl:[{
        filename: { type: String, required: true }
    }],

    comments: [{
        content: { type: String},
        commenterId: { type: String },
        commenterName: { type: String },
        commentedAt: {type: Date, default: Date.now},
        replies: [replySchema]
    }],
});

module.exports = mongoose.model('Post',postSchema);
