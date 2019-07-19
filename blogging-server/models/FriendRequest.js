var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FriendRequestSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User'},
    requestTo: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: Boolean, default: false }
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);