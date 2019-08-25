const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const users = require('../models/user'); //create new post schema
//const isEmpty = require('../common/empty');
//isempty check
function isEmpty(req) {
    console.log(req);
    for (var key in req) {
        if (req.hasOwnProperty(key))
            return false;
    }
    return true;
}

exports.search = function (req, res) {
    // res.send(req.params.name);

    // let query = { "name": req.params.name };
     let suche = req.params.name;


    if (suche) {
    
        users.find({ 'name': { '$regex': req.params.name, '$options': 'i' } },{password: 0}, function (err, post) {
            // console.log(post)
            if (err) {
                res.json({
                    data: err
                });
            }
            else {

                if (isEmpty(post)) {
                    res.send({
                        data: post,
                        msg: 'no result found',
                        status: false
                    });

                }
                else {
                    res.send({
                        msg: 'data success',
                        data: post
                    })
                }
            }

        })
    } else {
        res.send({
            msg: 'no keyword found'
        })
    }
};