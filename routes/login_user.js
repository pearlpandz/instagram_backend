const users = require('../models/user'); //create new post schema
const jwt = require('jsonwebtoken');
const config = require('./../common/config');
const posts = require('../models/index'); //create new post schema

exports.login = function (req, res) {
    let name = req.body.name,
        email = req.body.email;
    let conditions = !!name ? { name: name } : { email: email };

    if (!req.body) {
        res.json(
            {
                success: false,
                message: 'User data empty'
            }
        )
    }

    else {
        users.findOne(conditions, function (err, data) {
            if (err) {
                res.json(
                    {
                        success: false,
                        message: err
                    }
                )
            }
            else if (!data) {
                res.json(
                    {
                        success: false,
                        message: 'user not found!'
                    }
                )
            }
            else {
                if (req.body.password == data.password) {
                    posts.restore({ "_id": data.postids }, function (err2, post2) {
                        var token = jwt.sign({ name: req.body.name }, config.secret, {
                            expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });
                        if (err2) {
                            res.send('err2')
                        }
                        else {
                            if (!data.isVerified) {
                                res.json({
                                    mailsuccess: false,
                                    msg: "plz chk ur mail for  confirmation"
                                })
                            } else if (data.isVerified == true) {
                                res.json(
                                    {
                                        data: data,
                                        success: true,
                                        token: token,
                                        message: 'Successfully Signed In',
                                        email: data.email,
                                        name: data.name,
                                        id: data._id,
                                        profilepic: data.profilepic,
                                        tokens: token,
                                        verified: data.isVerified

                                    })
                            }
                        }
                    })
                } else {
                    res.json(
                        {
                            passsuccess: false,
                            message: 'user password wrong'
                        }
                    )
                }
            }
        });
    }
}