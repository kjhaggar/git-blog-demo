var express = require('express');
var router = express.Router();
var passport = require('passport'); 
var User = require('../models/user');
var Post = require('../models/addPost');
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

router.get('/profile', verifyToken, (req, res) => {
    User.findOne({ _id: req.decoded.userId }).select('userName email').exec((err, user) => {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!user) {
          res.json({ success: false, message: 'User not found' });
        } else {
          res.json({ success: true, user: user });
        }
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
      cb(null, '../client/src/assets/images')
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
            else {console.log(req.file)
                var imgUrl = req.file;
                user.image = imgUrl;

                user.save((err) => {
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong.' });
                    } else {
                        res.json({ success: true, message: 'Image saved' });
                    }
                });
            }
        }
        });
    });

router.get('/displayProfile/:id', function(req, res) {
        User.find({_id: req.params.id}).exec(function (err, user) {
            if (err) {
            console.log("Error:", err);
            } else {console.log(user)
                const x = [{'image': user.image}];
                console.log(user[0].image)
                res.json({success: true, data: {image: user[0].image}});
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
        console.log("Error:", err);
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

router.get('/getCommentsByPostId', function(req, res) {
    Post.find({}, (err, posts) => {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            if (!posts) {
                res.json({ success: false, message: 'No post found.' });
            } else {
                res.json({ success: true, posts: posts });
            }
        }
    });
});

router.put('/updatePost/:id', function(req, res, next) {
    Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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


module.exports = router;
