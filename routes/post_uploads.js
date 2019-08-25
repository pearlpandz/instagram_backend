const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Posts = require('../models/index'); //create new post schema

exports.upload = function(req, res) {
    var receiveArrayFiles = req.files;
    // console.log(receiveArrayFiles, 'received files-------------');
    var regularpath = [];
    // console.log(receiveArrayFiles);
    for (var i = 0; i < receiveArrayFiles.length; i++) {
        regularpath.push(req.protocol + "://" + req.get('host') + '/' + receiveArrayFiles[i].path);
    }

    // console.log(req.files, req.body);

    let posts = new Posts({
        sampleFile: regularpath,
        createdat: new Date().toLocaleString()
    });
    let mangooseid = req.body._id;

    var query = { "_id": mangooseid };
    var options = { new: true };
    Posts.findOneAndUpdate(query, { $set: { sampleFile: regularpath } }, options, function(err, post) {
        // console.log('000000 = ', err, post)
        if (err) {
            // console.log('got an error');
            res.send(err);
        } else {
            res.send(post);
        }

    });
}