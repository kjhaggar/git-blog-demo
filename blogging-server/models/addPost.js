var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    
    creationDate: {type: Date, default: Date.now},
    title: { type: String, require: true},
    description: {type: String, require: true}
});

module.exports = mongoose.model('Post',postSchema);