const users = require('../models/user'); //create new post schema


exports.changepwd = function (req, res) {
    let newpass = req.body.newpass;
    users.findOne({ name: req.body.name }, function (err, user) {


        if (req.body.oldpass != user.password) {
            res.json({ msg: 'notmatch ur old pasword' });
        } else {
            users.findOneAndUpdate({ name: req.body.name }, {
                $set: {
                    password: newpass
                }
            }, { new: true }, function (err1, user1) {
                if (err1) {
                    res.json({
                        status: false,
                        data: err1
                    });
                }
                if (user1) {
                    res.json({
                        status: true,
                        msg: 'New password updated',
                        data: user1
                    });
                } else {
                    res.json({
                        status: true,
                        msg: 'data not return',
                        data: user1
                    });
                }
            })
        }
    })
}

