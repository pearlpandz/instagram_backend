const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Posts = require('../models/index'); //create new post schema
const Users = require('../models/user'); //create new user schema

// check target in array or not
function checklikeid(array, target) {
    console.log(array, target);
    for (var i = 0; i < array.length; i++) {
        if (array[i] === target) {
            console.log('true');
            return true;
        }
    }
    console.log('false');
    return false;
}

exports.likepost = function(req, res) {
    // console.log(req.body.post_id);
    // console.log(req.body.current_userid);

    let post_id = req.body.post_id;
    let current_userid = req.body.current_userid;

    var query1 = { "_id": post_id };
    Posts.find(query1, function(err, post) {
        if (err) {
            res.json(err);
        } else {
            // res.send(checklikeid(post[0]['likeids'], current_userid));
            if (checklikeid(post[0]['likeids'], current_userid)) {
                var query3 = { "_id": post_id };
                var update3 = { likecount: parseInt(post[0].likecount) - 1 };
                var remove3 = { likeids: current_userid };
                var options3 = { new: true };
                Posts.findOneAndUpdate(query3, { $set: update3, $pull: remove3 }, options3, function(err, post3) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                            data: post3,
                            status: false,
                            msg: 'you dis liked this post'
                        });
                    }
                })
            } else {
                var query2 = { "_id": post_id };
                var update = { likecount: parseInt(post[0].likecount) + 1 };
                var update2 = { likeids: current_userid };
                var options = { new: true };
                Posts.findOneAndUpdate(query2, { $set: update, $push: update2 }, options, function(err, post1) {
                    if (err) {
                        res.send(err);
                    } else {
                        // res.send({
                        //     status: true, //it's very important because used in client side 
                        //     msg: 'you liked this post',
                        //     data: post1.userid
                        // }); 

                        Users.findOneAndUpdate({ "_id": post1.userid }, {
                            $push: {
                                notification: {
                                    'post_id': post_id,
                                    'liker_id': current_userid,
                                    'action': 'like'
                                }
                            }
                        }, { new: true }, function(err_notfi, data_notifi) {
                            if (err_notfi) {
                                res.send(err_notfi);
                            } else {
                                console.log('after notif', data_notifi);
                                res.json({
                                    data: data_notifi,
                                    post:post1,
                                    likecount: post1.likecount
                                });
                            }
                        });

                    }
                })
            }
        }
    });
};


exports.commentpost = function(req, res) {
    // res.send(req.body);

    var query = { "_id": req.body.post_id };
    var update = { comments: { msg: req.body.comment, username: req.body.commented_id, $inc: { comment_uuid: 1 } } };
    var options = { new: true };
    Posts.findOneAndUpdate(query, { $push: update }, options, function(err, comment) {
        if (err) {
            res.send(err);
        } else {
            res.send({
                status: true,
                data: comment
            });
        }
    })


}



exports.deletecomment = function(req, res) {
    // res.send({
    //     data: req.body.comment_id
    // })
    var query = { "_id": req.body.post_id };
    var update = { comments: { _id: req.body.comment_id } };

    var options = { new: true };
    Posts.findOneAndUpdate(query, { $pull: update }, options, function(err, comment) {
        if (err) {
            res.send(err);
        } else {
            res.send({
                status: true,
                msg: 'successfully comment deleted',
                data: comment
            });
        }
    })
}