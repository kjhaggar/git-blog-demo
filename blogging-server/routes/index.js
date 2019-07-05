var express = require('express');
var router = express.Router();
var passport = require('passport'); 
var User = require('../models/user');
var Post = require('../models/addPost');
var jwt = require('jsonwebtoken');

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


// router.use((req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) {
//     res.json({ success: false, message: 'No token provided' }); 
//   }
//   else {
//     jwt.verify(token, "qwerty@12345", (err, decoded) => {
//       if (err) {
//         res.json({ success: false, message: 'Token invalid: ' + err });
//       }
//       else {
//         req.decoded = decoded;
//         next(); 
//       }
//     });
//   }
// });

router.get('/profile', (req, res) => {
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

module.exports = router;

// async function addToCommentDB(req, res) {
//     Post.findOne({ _id: req.body.postId }, (err, post) => {
//         if (err) {
//             res.json({ success: false, message: 'Invalid post id' });
//         } else {
//             if (!post) {
//                 res.json({ success: false, message: 'post not found.' });
//             } else {
//                 User.findOne({ _id: req.decoded.userId }, (err, user) => {
//                     if (err) {
//                         res.json({ success: false, message: 'Something went wrong' });
//                       } else {
//                         if (!user) {
//                           res.json({ success: false, message: 'User not found.' });
//                         } else {
//                             post.comments.push({
//                                 content: req.body.comment,
//                                 commenterId: req.body.userId,
//                                 commenterName: req.body.userName
//                             });
//                             post.save((err) => {
//                                 if (err) {
//                                     res.json({ success: false, message: 'Something went wrong.' });
//                                 } else {
//                                     res.json({ success: true, message: 'Comment saved' });
//                                 }
//                             });
//                         }
//                     }
//                 });
//             }
//         }
//     });
// }