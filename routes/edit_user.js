const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const users = require('../models/user'); //create new post schema
const posts = require('../models/index'); //create new post schema
let softDelete = require('mongoosejs-soft-delete');
var mongoose_delete = require('mongoose-delete');
var bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(8);

// function checklikeid(array) {
//     var newarray = []
//     for (var i = 0; i <array.length; i++) {
       
//           newarray.push(array[i]);
//         // 
// } 
//  return newarray
// }
exports.create = function (req, res) {

    let query = { '_id': req.body.id };

    users.findOneAndUpdate(query,
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                website: req.body.website,
                bio: req.body.bio,
                gender: req.body.gender,
                phonenumber: req.body.phonenumber
            }
        }, { new: true },

        function (err, post) {
            if (err) {
                res.send(err);
            } else {
                console.log(post)
                res.send(post);
            }
        });



};

exports.disableaccount = function (req, res) {

    let query = { _id: req.body.id }

                      users.findOne(query, function (err1, post1) {
                            if (err1) {
                                res.send('err1')
                            } else {
                          
                                
                            // let newlist = post1.postids.length;
                            // console.log("hi", newlist)
                            
                                // console.log(post1.postids[i])
                                posts.removeMany({"_id":post1.postids}, function(err2,post2){
                                    if(err2){
                                        res.send('err2')
                                    }else{
                                        res.json({
                                            message: "going to disable"
                                        });
                                    }
                                })
                            }
                        
                        

                        })
                

                

           



}