var express = require('express');
var router = express.Router();
var passport = require('passport'); 
var User = require('../models/user');
var Post = require('../models/addPost');
var Request = require('../models/FriendRequest');
var jwt = require('jsonwebtoken');
var multer = require('multer');

router.post('/register', function (req, res, next) {
    addToDB(req, res);
});

async function addToDB(req, res) {
    var user = new User({
        email: req.body.email,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName:req.body.lastName,
        password: User.hashPassword(req.body.password)
    });
    
    try {
        doc = await user.save();
        return res.status(201).json(doc);
    }
    catch (err) {
        return res.status(501).json(err);
    }
}

function verifyToken(req, res, next){
    if (!req.headers.authorization){
        return res.status(401).send('Unauthorised request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token == 'null'){
        return res.status(401).send('Unauthorised request');
    }
    let payload = jwt.verify(token, 'qwerty@12345');
    if(!payload){
        return res.status(401).send('Unauthorised request');
    }
    req.userId = payload.subject;
    next();
}

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (err) {
            return res.status(501).json({ err, success: false, message: 'Unable To login.' });
        }
        if (!user) {
            return res.status(501).json({ success: false, message: 'Not the registered user' });
        }
        const token = jwt.sign({ id: user._id }, "qwerty@12345", { expiresIn: 86400 });
        req.logIn(user, function(err) {
            if (err) {
                return res.status(501).json(err);
            }
            return res.status(200).json({
                message:'Login Success',
                token: token,
                userId: user._id,
                userName: user.userName
            });
        });
    })(req, res, next);
});

router.post('/sendRequest', function(req, res, next) {
    var newRequest = new Request({
        user: req.body.senderId,
        requestTo: req.body.receiverId
    });
    newRequest.save((err) => {
        if (err) {
            res.json({ success: false, message: 'Something went wrong.' });
        } else {
            res.json({ success: true, message: 'Saved' });
        }
    });
});

router.post('/addPost', function(req, res, next) {
    addToPostDB(req, res);
});

async function addToPostDB(req, res) {
    const post = new Post({
        userId: req.body.userId,
        userName: req.body.userName,
        title: req.body.title,
        description: req.body.description
    });
    try {
        doc = await post.save();
        return res.status(201).json(doc);
    }
    catch (err) {
        return res.status(501).json(err);
    }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../blogging-server/static/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
  });

  var upload = multer({ storage: storage });

  router.put('/uploadData/:id', upload.single('image'), function(req, res, next) {
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (err) {
            res.json({ success: false, message: 'Something went wrong' });
        }
        else {
            if (!user) { res.json({ success: false, message: 'User not found.' });}
            else {
                console.log(req.body)
                var updatedDetails = JSON.parse(req.body.forminput);
                if(req.file) {
                    var imgUrl = req.file.filename;
                    user.image = imgUrl;
                }
                user.userName =updatedDetails.userName;
                user.firstName = updatedDetails.firstName;
                user.lastName = updatedDetails.lastName;

                if(updatedDetails.password != null) {
                user.password = User.hashPassword(updatedDetails.password);
                }

                user.save((err) => {
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong.' });
                    } else {
                        res.json({ success: true, message: 'Profile updated..!!' });
                    }
                });
            }
        }
        });
    });

router.get('/displayProfilePicture', function(req, res) {
    User.find({}).select('image').exec(function (err, user) {
        if (err) {
        console.log("Error:", err);
        } else {
            res.json({success: true, user });
        }
    });
});

router.get('/allPost',function(req,res){
  Post.find({}).exec(function (err, posts) {
    if (err) {
      console.log("Error:", err);
    }
    else {

      res.send(posts);
    }
  });
});

router.get('/getPostById/:id', function(req, res) {
    Post.find({userId: req.params.id}).exec(function (err, posts) {
        if (err) {
        // console.log("Error:", err);
        } else {
            res.send(posts);
        }
    });
});

router.post('/addComment', function(req, res, next){
    addToCommentDB(req, res);
})

async function addToCommentDB(req, res) {
    Post.findOne({ _id: req.body.postId }, (err, post) => {
        if (err) {
            res.json({ success: false, message: 'Invalid post id' });
        } else {
            if (!post) {
                res.json({ success: false, message: 'post not found.' });
            } else {
                post.comments.push({
                    content: req.body.comment,
                    commenterId: req.body.userId,
                    commenterName: req.body.userName
                });
                post.save((err) => {
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong.' });
                    } else {
                        res.json({ success: true, message: 'Comment saved' });
                    }
                });
            }
        }
    });
}

router.post('/addReply', function(req, res, next){
    addToReplyDB(req, res);
})

async function addToReplyDB(req, res) {
    Post.findOne({ _id: req.body.postId }, (err, post) => {
        if (err) {
            res.json({ success: false, message: 'Invalid post id' });
        } else {
            if (!post) {
                res.json({ success: false, message: 'post not found.' });
            } else {
                post.comments.id({_id: req.body.commentId}).replies.push({
                    content: req.body.content,
                    commenterId: req.body.userId,
                    commenterName: req.body.userName
                });
                post.save((err) => {
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong.' });
                    } else {
                        res.json({ success: true, message: 'Comment saved' });
                    }
                });
            }
        }
    });
}

router.put('/updatePost/:id', function(req, res, next) {
    Post.findByIdAndUpdate(req.params.id, req.body , function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
  });

router.delete('/deletePost/:id', function(req, res, next) {
    Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
  });

  router.get('/getProfileData/:id', verifyToken, (req, res) => {
    User.findOne({ _id: req.params.id }).exec((err, user) => {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!user) {
          res.json({ success: false, message: 'User not found' });
        } else {
          res.json({ success: true, user });
        }
      }
    });
  });

  router.delete('/deleteProfilePicture/:id', function(req, res, next) {
    User.update({ _id: req.params.id },{$unset: { image: 1}}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
  });

  router.get('/getUsersList', function(req, res) {
    User.find({}).exec(function (err, user) {
        if (err) {
        console.log("Error:", err);
        } else { 
            res.json(user);
        }
    });
});

router.get('/requestList/:id', function(req, res) {
    Request.find({ requestTo: req.params.id}).exec(function (err, request) {
        if (err) {
        console.log("Error:", err);
        } else {
            console.log(request);
            var pendingRequestId = request.map(({user}) => user);
            User.find({_id: { $in: pendingRequestId }}).exec(function (err, pendingUserProfile) {
                if(err) {
                    console.log("Error:", err);
                } else {
                    console.log(pendingUserProfile)
                    res.send({ pendingUserProfile, pendingRequestId });
                }
            } )
        }
    });
});

router.get('/sentRequestList/:id', function(req, res) {
    Request.find({ user: req.params.id}).exec(function (err, request) {
        if (err) {
        console.log("Error:", err);
        } else {
            console.log(request);
            var pendingRequestId = request.map(({requestTo}) => requestTo);
            res.send({pendingRequestId});
            // User.find({_id: { $in: pendingRequestId }}).exec(function (err, pendingUserProfile) {
            //     if(err) {
            //         console.log("Error:", err);
            //     } else {
            //         console.log(pendingUserProfile)
            //         res.send({ pendingUserProfile, pendingRequestId });
            //     }
            // } )
        }
    });
});
module.exports = router;
