const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Posts = require('../models/index'); //create new post schema
const users = require('../models/user');//create user schema
exports.create = function(req,res){

    let post = new Posts ({
      description: req.body.description,
      location: req.body.location,
      sampleFile: req.body.sampleFile,
      createdat: new Date().toLocaleString(),
      username: req.body.username,
      profilepic: req.body.userpic,
      userid: req.body.userid
    });
  
    post.save(function(err,result){
        if(err){
            console.log(err);
        }
        else {
            // res.json({id: result['_id'] });
        users.findOneAndUpdate({_id: req.body.userid}, { $push: { postids: {"_id":result['_id']}}},function(err1,post1){
            if(err1){
                res.send('err')
            }else{
                res.json({
                    id: result['_id'],
                     data:post1
                  }  )
            }


        })
            
        }
    });  
  };