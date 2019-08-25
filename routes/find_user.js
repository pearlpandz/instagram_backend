const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const users = require('../models/user'); //create new post schema
const posts = require('../models/index');
exports.finde = function (req, res) {
    console.log(req.params);
    // let query = { "name": req.params.name };
    // let suche = req.params.name;
    var arraydata = [];


    users.findOne({ 'name': req.params.name }, { password: 0 }, function (err, post) {
        // console.log(post);

        if (post) {
            console.log(post['_id']);
            arraydata.push(post);
            posts.find({ userid: post['_id'] }, function (err, data) {

                if (data) {
                    console.log(data)
                    arraydata.push(data);
                    res.send(arraydata);

                } else {
                    res.send(err);
                }

            })
        }
    })


};

