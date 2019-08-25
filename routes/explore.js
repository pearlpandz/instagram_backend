const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Posts = require('../models/index'); //create new post schema
const users = require('../models/user'); //create new user schema
/* function checkfollowers(post, followersid) {
  var followers = followersid.followers;
  for (var i = 0; i < post.length; i++) {
    if (followers.includes(post[i]._id)) {
      return false;
    } else {
      return true;
    }
  }
} */
var newarray = [];
function checkfollowers(a, b) {
  var missings = [];
  var matches = false;
  for (var i = 0; i < a.length; i++) {
    matches = false;
    for (var j = 0; j < b.length; j++) {
      if (a[i] == b[j]) matches = true;
    }
    if (!matches) missings.push(a[i]);
  }
  return missings;
}
var list = [];
/* function checkfollowers(array, target) {

  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < target.length; j++) {
      if (array[i] != target[j]) {
        list.push(array[i]);
      }
    }
  }
  return list;
} */
exports.exploreposts = function (req, res) {
  // var mysort = { likecount: -1 };
  // Posts.find({}).sort(mysort).exec(function (err, post) {
  Posts.find({}).exec(function (err, post) {
    if (err) {
      res.json(err);
    }
    else {
      res.json({
        data: post
      });
    }
  });
};


exports.explorepostprevious = function (req, res, next) {
  try {
    Posts.findOne({ _id: { $lt: (req.body.id) } }).sort({_id: -1 }).limit(1).exec(function (err2, previouspost) {
      if (err2) {
        res.send(err2)
      } else {
        if(previouspost){
          res.send(previouspost);
        }else{
          res.send("Invalid");
        }
      }
    })
  } catch (error) {

  }

}
exports.explorepostafter = function (req, res, next) {
  console.log(req.body.id)
  try {
    Posts.findOne({ _id: { $gt: (req.body.id) } }).sort({_id: 1 }).limit(1).exec(function (err2, afterpost) {
      if (err2) {
        res.send(err2)
      } else {
        if(afterpost){
          res.send(afterpost)
        } else{
          res.send("Invalid");
        }
      }
    })
  } catch (error) {

  }

}

/*     exports.getrecentusers = function (req, res, next) {
      var mysortdate = { createdat: -1 };
      try {
        users.find({}).sort(mysortdate).exec(function (err2, users) {
          if (err2) {
            res.send(err2)
          } else {
            res.send(users)
          }
        })
      } catch (error) {
    
      }
    
    }  */

exports.getrecentusers = function (req, res) {

  var mysortdate = { createdat: -1 };
  // Posts.find({}).sort(mysort).exec(function (err, post) {
  users
    .distinct("_id").exec(function (err, post) {
      if (err) {
        res.json(err);
      }
      else {
        users.findOne({ _id: req.body.user_id }, function (err1, followersid) {
          if (err1) {
            res.json(err1);
          } else {
            newarray = checkfollowers(post, followersid.following);
            users.find({ _id: newarray }).limit(4).exec(function (err2, post2) {
              if (err2) {
                res.send("err2")
              } else {
                res.send(post2)
              }
            })
          }
        });

      }
    });
};
// find( { "date": { $gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000))) } } ).sort({ "date": -1 })

exports.getcurrentuserpost = function(req,res){
  users.findOne({ _id: req.body.user_id }, function (err1, userspost) {
    if (err1) {
      res.json(err1);
    } else {
      res.send(userspost);
    }
    });
}