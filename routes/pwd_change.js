const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const users = require('../models/user'); //create new post schema
const posts =  require('../models/index') 
var bcrypt = require('bcrypt');
let salt= bcrypt.genSaltSync(8);

    exports.changepwd = function(req, res) {
    //old password for bcrypt compare 
    //new password for set
    
    let newpass = bcrypt.hashSync(req.body.newpass, salt);
    users.findOne({ name: req.body.name }, function(err, user) {
    
    bcrypt.compare(req.body.oldpass, user.password, function(err, pass) {
    if (err) {
    res.json({msg:'notmatch ur old pasword'});
    } else {
    console.log(pass);
    if (pass == true) {
    users.findOneAndUpdate({ name: req.body.name }, {
    $set: {
    password: newpass
    }
    }, { new: true }, function(err1, user1) {
    
    if (err1) {
    res.json({
    status: false,
    data: err1
    });
    }
    if (user1) {
    res.json({
    status: true,
    msg: 'New password updated',
    data: user1
    });
    } else {
    res.json({
    status: true,
    msg: 'data not return',
    data: user1
    });
    }
    })
    } else {
    res.json({
    status: pass,
    msg: 'The is your old password'
    })
    }
    }
    })
    })
    };
    
