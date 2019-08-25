const mongoose = require('mongoose');
let softDelete = require('mongoosejs-soft-delete');
var mongoose_delete = require('mongoose-delete');
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const newUserSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: String,
    following: [],
    followers: [],
    blockids: [],
    profilepic: String,
    createdat: String,
    id: String,
    provider: String,
    username: { type: String, index: true, sparse: true },
    website: String,
    bio: String,
    phonenumber: String,
    gender: String,
    postids: [],
    resettoken: String,
    token: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    notification: [{
        post_id: String,
        liker_id: String,
        action: String,
    }]
});


newUserSchema.plugin(softDelete);
var users = mongoose.model('users', newUserSchema);
module.exports = users;