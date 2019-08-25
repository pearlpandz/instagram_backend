const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const users = require('../models/user'); //create new post schema
const posts = require('../models/index'); //create new post schema
const jwt = require('jsonwebtoken');
const config = require('./../common/config');
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(8);
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: 'themeddesigns@gmail.com',
        pass: 'MedDesigns2018'
    }
}));


exports.verifySMTP = function(req, res) {
    transporter.verify(function(error, success) {
        if (error)
            res.send(error)
        else
            res.send('server is ready to take our message')
    })
}

function isEmpty(req) {
    for (var key in req) {
        if (req.hasOwnProperty(key))
            return false;
    }
    return true;
}


//checking... Array targat
function checklikeid(array, target) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == target) {

            return true;
        }
    }
    return false;
}

// signup
exports.adduser = function(req, res) {
    profilepic = req.protocol + "://" + req.get('host') + '/uploads/noimage.png';

    if (req.body.profilepic)
        profilepic = req.body.profilepic;

    let user = new users({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        profilepic: profilepic,
        createdat: new Date().toLocaleString()
    });

    users.findOne({ email: req.body.email, name: req.body.name }, function(err, data) {
        if (data)
            res.json({ success: false, message: 'User Already Exist!' });
        else {
            user.save(function(err, result) {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'change ur username'
                    })
                } else {
                    var token = jwt.sign({ name: req.body.name }, config.secret, {
                        expiresIn: 60 * 60 * 24 // expires in 24 hours
                    });
                    transporter.verify(function(error, success) {
                        if (error)
                            console.log(error)
                        else
                            console.log('server is ready to take our message')
                    })
                    var mailOptions = {
                        from: 'themeddesigns@gmail.com',
                        to: result.email,
                        subject: 'confirmation',
                        text: 'Hello ' + result.name + ', You recently request a confirmation. Please click on the link below to confirm:<br><br><a href="http://localhost:4200/redirect/' + token + '/' + result.email,
                        html: 'Hello<strong> ' + result.name + '</strong>,<br><br>You recently request a confirmation. Please click on the link below to confirmation:<br><br><a href="http://localhost:4200/redirect/' + token + '/' + result.email + '">http://localhost:4200/redirect/</a>'
                    };
                    transporter.sendMail(mailOptions, function(err, info) {
                        if (err) console.log(err);
                    });
                    res.json({
                        success: true,
                        message: 'Successfully Signed aUp click mail to login',
                        token: token,
                        email: user.email,
                        name: user.name,
                        id: user._id,
                        profilepic: user.profilepic
                    });
                }
            });
        }
    });
};

// social signup
exports.socialuser = function(req, res) {

    let Userdata = new users({
        name: req.body.name,
        email: req.body.email,
        profilepic: req.body.profilepic,
        provider: req.body.provider,
        createdat: new Date().toLocaleString()
    });

    users.findOne({ email: req.body.email }, function(err, data) {
        if (err) {
            // res.send(err);
            res.json({
                success: false
            })
        }
        if (data) {

            if (req.body.provider == data.provider) {
                var token = jwt.sign({ name: req.body.name }, config.secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                res.json({
                    success: true,
                    message: 'Successfully Signed Up',
                    token: token,
                    email: data.email,
                    name: data.name,
                    id: data._id,
                    profilepic: data.profilepic
                });
            }
        } else {
            var token = jwt.sign({ name: req.body.name }, config.secret, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
            Userdata.save(function(err, result) {
                if (err) {
                    res.json({

                        success: false,
                        msg: "signup with username name new"
                    });
                } else {
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Successfully Signed Up',
                        token: token,
                        email: result.email,
                        name: result.name,
                        id: result._id,
                        profilepic: result.profilepic
                    });
                }
            });

        }
    });
}

//set unique name for edituser
exports.editUniqueName = function(req, res) {
    users.findOne({ name: req.body.name }, function(err, detail) {


            if (isEmpty(detail)) {
                users.distinct(req.body.name, function(err, names) {


                    if (checklikeid(names, req.body.name)) {

                        res.json({
                            success: true,
                            msg: "username already exists...please try with anothor name",
                        })

                    } else {
                        res.json({
                            msg: 'proceed',
                            success: false
                        })
                    }

                })
            } else {
                if (req.body.name == detail.name) {


                }
            }
        }



    )
}

// set unique name for user
exports.Uniquename = function(req, res) {
    users.distinct(req.body.field, function(err, names) {


        if (checklikeid(names, req.body.name)) {

            res.json({
                success: true,
                msg: "username already exists...please try with anothor name",
            })

        } else {
            res.json({
                msg: 'proceed',
                success: false
            })
        }

    })
}

// set unique name for email
exports.Uniquemail = function(req, res) {
    users.distinct('email', function(err, email) {
        if (checklikeid(email, req.body.email)) {
            res.json({
                success: true,
                msg: "email already exists...please try with anothor name"
            })

        } else {
            res.json({
                msg: 'proceed',
                success: false
            })
        }

    })
}

//block & unblock user
exports.blockuser = function(req, res) {
    if (req.body.userid && req.body.blockid) {

        users.findOne({ _id: req.body.userid }, function(err, userdata) {
            if (err) {
                res.send(err);
            } else {
                // res.send(userdata['blockids']);

                if (checklikeid(userdata['blockids'], req.body.blockid)) {
                    let query = { '_id': req.body.userid };
                    let update = { blockids: req.body.blockid };
                    var options = { new: true };
                    users.findOneAndUpdate(query, { $pull: update }, options, function(err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send(data._id);
                        }
                    });
                } else {
                    let query = { '_id': req.body.userid };
                    let update = { blockids: req.body.blockid };
                    var options = { new: true };
                    users.findOneAndUpdate(query, { $push: update }, options, function(err, data) {
                        if (err) {
                            // res.send(err);
                            msg: "error"
                        }
                        else {
                            res.send(data._id);
                        }
                    });
                }
            }
        })
    } else {
        req.send({
            status: false,
            msg: 'Waiting for inputs'
        })
    }

}

//get all blockids of requested userid
exports.getblockids = function(req, res) {
    if (req.body.userid) {

        users.findOne({ _id: req.body.userid }, function(err, userdata) {
            if (err) {
                // res.send(err);
            } else {
                res.send(userdata['blockids']);
            }
        })
    } else {
        req.send({
            status: false,
            msg: 'Waiting for inputs'
        })
    }

}

// find all
exports.allfind = function(req, res) {

    users.find({}, function(err, user) {

        if (err) {
            res.send("err no users");
        } else {
            res.send(user);
        }

    })
}

// upload single image
exports.uploadSingle = function(req, res) {
    var receiveArrayFiles = req.file;
    var regularpath;

    regularpath = req.protocol + "://" + req.get('host') + '/' + receiveArrayFiles.path;


    let mangooseid = req.body.id;
    var query = { "_id": mangooseid };
    var options = { new: true };

    users.findOneAndUpdate(query, { $set: { profilepic: regularpath } }, options, function(err, user) {
        if (err) {} else {
            res.send(user);
        }
    });
}

// delete image
exports.deleteimage = function(req, res) {
    var query = { "_id": req.body.id };
    // var receiveArrayFiles = req.file;
    var noprofilepic;
    noprofilepic = req.protocol + "://" + req.get('host') + '/uploads/noimage.png';

    var options = { new: true };

    users.findOneAndUpdate(query, { $set: { profilepic: noprofilepic } }, options, function(err, user) {
        if (err) {
            res.send('got an error');
        } else {
            res.json({
                changed: true,
                data: user.profilepic
            });
        }
    });
}