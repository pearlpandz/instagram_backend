

//find allpost
const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Posts = require('../models/index'); //create new post schema
const users = require('../models/user'); //create new user schema
var mongoose_delete = require('mongoose-delete');
exports.getpost = function (req, res) {
  
  users.find( {"name":req.body.name},function(err, data){
    if( err){
      console.log("err")
    }else{
    
    if(data[0] ){
      if (req.body.skip == 0) {
    limits = 2;
    addskip = parseInt(req.body.skip) + limits;
    console.log(addskip);
  } else {
    limits = 3;
    addskip = parseInt(req.body.skip) + limits;
    console.log(addskip);
  }
        Posts.find({ $or:[ {'userid':data[0].following}, {'userid':data[0]._id} ]}).sort('-createdat').skip(parseInt(req.body.skip)).limit(2).exec(function(err, post){
          if(err){
            console.log("err")
          }else{
            res.json({
                    data: post,
                    skip: addskip
                  });
           
          }
        })
      

    }
    
    }

  })





};


//api for call post and user
exports.singlepostafter = function (req, res) {
  users.findOne({ _id: req.body.id }, function (err1, post1) {
    if (err1) {
      res.send('err')
    } else {

      var spot_id = parseInt(req.body.indexid)
      arraylength = post1.postids.length;
      console.log(arraylength);

      var query = post1.postids[spot_id];

      // increment(spot_id);
      if (req.body.indexid < arraylength) {
        Posts.findOne(query, function (err2, post2) {

          if (err2) {
            res.send(err2)
          } else {
            res.send(post2)
          }
        })
      } else {
        res.json({
          data: 'false',
          success: false

        });
      }
    }

  })
}

function increment(index) {

  index++;
}

function decrement(index) {
  index--;
}

// api for call previous post
exports.singlepostsprevious = function (req, res, next) {
  users.findOne({ _id: req.body.id }, function (err1, post1) {
    if (err1) {
      res.send('err')
    } else {
      // res.send(post1)
      var spot_id = parseInt(req.body.indexid)

      var query = post1.postids[spot_id];
      // decrement(spot_id);
      // res.send(query );
      Posts.findOne(query, function (err2, post2) {

        if (err2) {
          res.send(err2)
        } else {
          res.send(post2)
        }
      })

    }

  })
}

