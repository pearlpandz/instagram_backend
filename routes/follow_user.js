const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const users = require('../models/user'); //create new post schema

//checking...
function checklikeid(array, target) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == target) {
            return true;
        }
    }
    return false;
}


exports.follow = function (req, res) {
    if (req.body.user_id && req.body.follower_id) {
        var query = { "_id": req.body.user_id };
        var query1 = { "_id": req.body.follower_id };
        var options = { new: true };
        users
            .distinct("_id")

            .exec(function (err, resu) {
                if (err) {
                    res.json(err)
                }
                else {
                    if (checklikeid(resu, req.body.user_id) && checklikeid(resu, req.body.follower_id)) {
                        users.find(query, function (err, post) {
                            if (err) {
                                res.json(err)
                            } else {
                                // res.send(post)
                                // console.log(checklikeid(post[0]['followers'], req.body.follower_id));

                                //   console.log(checklikeid(post[0]['following'], req.body.follower_id ));

                                users.find(query1, function (err1, post1) {
                                    if (err) {
                                        res.json(err)
                                    } else {
                                        //    res.send(post1);

                                        // console.log(checklikeid(post1[0]['following'], req.body.user_id));

                                        if (checklikeid(post[0]['followers'], req.body.follower_id) && checklikeid(post1[0]['following'], req.body.user_id)) {
                                            //res.send('pull')
                                            users.findOneAndUpdate(query, { $pull: { followers: req.body.follower_id } }, options, function (err, post) {

                                                if (err) {
                                                    res.json(err);
                                                }
                                                else {
                                                    users.findOneAndUpdate(query1, { $pull: { following: req.body.user_id } }, options, function (err2, post2) {

                                                        if (err2) {
                                                            res.json(err2);
                                                        }
                                                        else {
                                                            res.json({
                                                                sucess: false,
                                                                userid: post,
                                                                followerid: post2
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }



                                        else {
                                            // res.send('push')
                                            users.findOneAndUpdate(query, { $push: { followers: req.body.follower_id } }, options, function (err, post) {

                                                if (err) {
                                                    res.json(err);
                                                }
                                                else {
                                                    users.findOneAndUpdate(query1, { $push: { following: req.body.user_id } }, options, function (err2, post2) {

                                                        if (err2) {
                                                            res.json(err2);
                                                        }
                                                        else {
                                                            res.json({
                                                                sucess: true,
                                                                userid: post,
                                                                followerid: post2
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }


                                    }
                                })


                            }
                        })


                    } else {
                        res.json({
                            msg: 'data not found'
                        })
                    }
                }
            })
    }
    else {
        res.json({
            msg: 'data not found'

        })
    }
};



exports.followcheck = function (req, res) {
    // console.log(req.body.user_id);
    // console.log(req.body.follower_id);
    if (req.body.user_id && req.body.follower_id) {



        var query = { "_id": req.body.user_id };
        var query1 = { "_id": req.body.follower_id };
        var options = { new: true };
        //ids = {type: String}

        users
            .distinct("_id")

            .exec(function (err, resu) {
                if (err) {
                    res.json(err)
                }
                else {
                    //   res.send(resu);
                    if (checklikeid(resu, req.body.user_id) && checklikeid(resu, req.body.follower_id)) {


                        users.find(query, function (err, post) {
                            if (err) {
                                res.json(err)
                            } else {
                                // res.send(post)
                                // console.log(checklikeid(post[0]['followers'], req.body.follower_id));

                                //   console.log(checklikeid(post[0]['following'], req.body.follower_id ));

                                users.find(query1, function (err1, post1) {
                                    if (err) {
                                        res.json(err)
                                    } else {
                                        //    res.send(post1);

                                        // console.log(checklikeid(post1[0]['following'], req.body.user_id));

                                        if (checklikeid(post[0]['followers'], req.body.follower_id) && checklikeid(post1[0]['following'], req.body.user_id)) {
                                            //res.send('pull')
                                            users.findOne(query, { followers: req.body.follower_id }, options, function (err, post) {

                                                if (err) {
                                                    res.json(err);
                                                }
                                                else {
                                                    users.findOne(query1, { following: req.body.user_id }, options, function (err2, post2) {

                                                        if (err2) {
                                                            res.json(err2);
                                                        }
                                                        else {
                                                            res.json({
                                                                sucess: false,
                                                                userid: post,
                                                                followerid: post2
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }



                                        else {
                                            // res.send('push')
                                            users.findOne(query, { followers: req.body.follower_id }, options, function (err, post) {

                                                if (err) {
                                                    res.json(err);
                                                }
                                                else {
                                                    users.findOne(query1, { following: req.body.user_id }, options, function (err2, post2) {

                                                        if (err2) {
                                                            res.json(err2);
                                                        }
                                                        else {
                                                            res.json({
                                                                sucess: true,
                                                                userid: post,
                                                                followerid: post2
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }


                                    }
                                })


                            }
                        })


                    } else {
                        res.json({


                            msg: 'data not found'

                        })
                    }
                    // console.log( checklikeid(resu, req.body.follower_id) );
                }
            })
    }

    else {
        res.json({


            msg: 'data not found'

        })
    }
};
exports.followlist = function (req, res) {

    users.find({ _id: req.body.id }, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            // res.send(data[0].following);
            users.find({ _id: data[0].following }, function (err2, data2) {
                if (err2) {
                    res.json('err2')
                } else {
                    res.json({
                        data: data2,
                        msg: "Following"
                    });
                }
            })
        }
    })

}

exports.followerlist = function (req, res) {

    users.find({ _id: req.body.id }, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            //  res.send(data[0].followers);
            users.find({ _id: data[0].followers }, function (err2, data2) {
                if (err2) {
                    res.send('err2')
                } else {
                    res.json({
                        data: data2,
                        msg: "follow"
                    });
                }
            })
        }


    })

}