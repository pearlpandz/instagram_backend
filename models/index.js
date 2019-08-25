const mongoose = require('mongoose');
let softDelete = require('mongoosejs-soft-delete');
var mongoose_delete = require('mongoose-delete');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
const newPostSchema = new mongoose.Schema({
    description: {type: String},
    location: {type: String},
    sampleFile: [],
    createdat: {type: String },
    username: {type: String},
    profilepic: {type: String},
    userid: {type: String},
    likecount: {
        type: Number,
        default: 0
    },
    likeids: [],
   
    comments: [
        {   
            username: { type: String },
            msg: { type: String },
            comment_uuid: { type: Number },
        }
    ]
});
newPostSchema.plugin(softDelete);
var posts = mongoose.model('posts', newPostSchema);

module.exports = posts;