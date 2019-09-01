// npm config set strict-ssl=false

//node dependencies - express
const express = require('express');
var multer = require('multer');
const app = express();

var cors = require('cors');
const server = require('http').createServer(app);
const jwt = require('jsonwebtoken');
http = require('http');
var io = require('socket.io')(server);
//node dependencies - mangoose
const mongoose = require('mongoose');


// define port
const port = process.env.PORT || 3000;


const db_url = "mongodb+srv://pearlpandz:muthu.pandi1@insta-muz4i.mongodb.net/instagram"

//mangoose.connect
const db = mongoose.createConnection(db_url, { useNewUrlParser: true });
db.then(data=>{
    console.log('db connected');
})
mongoose.connect(db_url, { useCreateIndex: true, useNewUrlParser: true });

// node dependencies - bodyparser, path
const bodyParser = require('body-parser');
const path = require('path');


app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

// given full permission to access this folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// middleware
const middleware = require('./common/middleware'); //common middleware for all requests
console.log('-------------------------------');
// calling routes folder
const routes_posts = require('./routes/index'); //create new post schema
const routes_upload_post = require('./routes/post_uploads'); //create new post schema
const routes_getposts = require('./routes/get_posts'); //get all post data
const create_user = require('./routes/add_user'); //create user
const userlogin = require('./routes/login_user'); //user login
const searchuser = require('./routes/search_user'); // search User

const likepost = require('./routes/like_post');
const follows = require('./routes/follow_user');
const findusers = require('./routes/find_user');
const editusers = require('./routes/edit_user');
const nodemail = require('./routes/nodemail');
const changepass = require('./routes/pwd_change');
const explore = require('./routes/explore');
const getcurrentuserpost = require('./routes/explore');

// file upload multer function
var upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, 'uploads');
        },
        filename: function(req, file, callback) {
            callback(null, Date.now() + '.' + file.mimetype.split('/').pop());
        }
    })
});


// create new postcd 
app.post('/post', routes_posts.create);

//upload post pic
app.post('/upload', upload.array('sampleFile'), routes_upload_post.upload);
app.post('/uploadSingle', upload.single('myFile'), create_user.uploadSingle);
app.post('/deleteimage', create_user.deleteimage);


//get posts middleware.checkToken,
app.post('/getpost', routes_getposts.getpost);
//get next post
app.post('/singlepostafter', routes_getposts.singlepostafter);
//get previous post
app.post('/singlepostsprevious', routes_getposts.singlepostsprevious);

//create user
app.post('/signup', create_user.adduser);
app.post('/socialuser', create_user.socialuser);

//create user
app.post('/login', userlogin.login);
app.get('/smtp', create_user.verifySMTP)

//search user
app.post('/search/:name', searchuser.search);

//like post
app.post('/likepost', likepost.likepost);


// comment post
app.post('/commentpost', likepost.commentpost);
app.post('/deletecomment', likepost.deletecomment);

//get all userid
app.post('/blockuser', create_user.blockuser);
app.post('/getblockids', create_user.getblockids);

//follow users
app.post('/follows', follows.follow);
app.post('/followcheck', follows.followcheck);
app.post('/followinglist', follows.followlist);
app.post('/followerlist', follows.followerlist);
//nodemailer function
app.post('/mailreset/:token', nodemail.mailreset);
app.post('/mail', nodemail.mail);
app.post('/confirmationemail/:token/:email', nodemail.confirmationemail);
//edit user

//nodemailer function
app.post('/updateuser', editusers.create);
app.post('/disable', editusers.disableaccount);

//change password api
app.post('/changepassword', changepass.changepwd);
//unique user name
app.post('/uniquename', create_user.Uniquename);

//uniquename set for edit user
app.post('/edituniquename', create_user.editUniqueName);
//disable account

//find all
app.get('/findall', create_user.allfind);
app.post('/explorepostprevious', explore.explorepostprevious);

app.post('/explorepostafter', explore.explorepostafter);
//explore 
app.post('/explore', explore.exploreposts);

app.post('/getrecentusers', explore.getrecentusers);

app.post('/getcurrentuserpost', explore.getcurrentuserpost);

//find particular user through URL
app.post('/:name', findusers.finde);



// run server
server.listen(port, () => console.info(`App running on port ${port}`));

const connections = [];

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log(' %s sockets is connected', connections.length);
});