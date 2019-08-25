var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const Posts = require('../models/index'); //create new post schema
const users = require('../models/user'); //create new user schema
const jwt = require('jsonwebtoken');
const config = require('./../common/config');
var bcrypt = require('bcrypt');
let salt= bcrypt.genSaltSync(8);
var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'muthu@appoets.com',
    pass: 'muthu.pandi1'
  }
}));

exports.mail = function(req,res){
    users.findOne({ email: req.body.email }).exec(function(err, user) {
        if (err) throw err; 
        if (!user) {
            res.json({ success: false, message: 'Username was not found' }); 
        }  else {
            user.resettoken = jwt.sign({ name: user.name, email: user.email },config.secret, { expiresIn: '24h' }); 
            
            user.save(function(err) {
                if (err) {
                    res.json({ success: false, message: err }); 
                } else {
                  
                    var mailOptions = {
                                        from: 'muthu@appoets.com',
                                        to: user.email,
                                        subject: 'Localhost Reset Password Request',
							text: 'Hello ' + user.name + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:4200/reset/' + user.resettoken,
							html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:4200/reset/' + user.resettoken + '">http://localhost:4200/reset/</a>'
						
                                    };
                                      
                    
                    transporter.sendMail(mailOptions , function(err, info) {
                        if (err) console.log(err); 
                    });
                    res.json({ success: true, message: 'Please check your e-mail for password reset link' }); 
                }
            });
        }
    });
}

exports.mailreset = function(req,res) {
    users.findOne({ resettoken: req.params.token }).select().exec(function(err, user) {
        if (err) throw err; 
        var token = req.params.token; 
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Password link has expired' }); 
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Password link has expired please click forgot password again' }); 
                } else {
                   
                    users.findOne({ email: user.email }).select('username email name password resettoken').exec(function(err, user) {
                        if (err) throw err; 
                        if (req.body.password == null || req.body.password == '') {
                            res.json({ success: false, message: 'Password not provided' });
                        } else {
                            user.password =  bcrypt.hashSync(req.body.password, salt); 
                            user.resettoken = false; 
                            
                            user.save(function(err) {
                                if (err) {
                                    res.json({ success: false, message: err });
                                } else {
                                   
                                    var email = {
                                        from: 'muthu@appoets.com',
                                        to: user.email,
                                        subject: 'Localhost Reset Password',
                                        text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at localhost.com',
                                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com'
                                    };
                                  
                                    transporter.sendMail(email, function(err, info) {
                                        if (err) console.log(err);
                                    });
                                    res.json({ success: true, message: 'Password has been reset!' }); 
                                }
                            });
                        }
                    });
                   

                
                }
            }
        });
    });
}


exports.confirmationemail = function (req, res, next) {
  console.log(req.params);
 
  if(!req.params){
      res.send('notvalid')
  }else{
    //   res.send('valid')
    users.findOne({email: req.params.email},function(err,data){
        if(err){
            console.log("err")
        }else{
            // res.send(data);
            if (!data) return res.json({ msg: 'We were unable to find a user for this token.' });
                if (data.isVerified) return res.json({ type: 'already-verified',data:data, msg: 'This user has already been verified.' });
     
            //     // Verify and save the user
                data.isVerified = true;
                data.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.json({data:data,msg:"The account has been verified. Please log in."});
                });
        }
    })
  }
    

};