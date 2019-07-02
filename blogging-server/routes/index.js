var express = require('express');
var router = express.Router();
var passport = require('passport'); 
var User = require('../models/user');
var Post = require('../models/addPost');
var Comment = require('../models/comment')
const jwt = require('jsonwebtoken');

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

router.post('/login',function(req,res,next){debugger
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) { return res.status(501).json(info); } 

    const token = jwt.sign({ id: user._id },"qwerty@12345", {
      expiresIn: 86400 // expires in 24 hours  
    });

    req.logIn(user, function(err) {
        if (err) { return res.status(501).json(err); }
        return res.status(200).json({message:'Login Success', token,"userId": user._id,"userName": user.userName});
      });

  })(req, res, next);
});

router.post('/addPost',function(req,res,next){
  addToPostDB(req, res);
})
async function addToPostDB(req, res) {

  var post = new Post(req.body);
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

router.get('/getPostById/:id',function(req,res){
  Post.find({userId: req.params.id}).exec(function (err, posts) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.send(posts);
    }
  });
});

router.post('/addComment',function(req,res,next){
  addToCommentDB(req, res);
})
async function addToCommentDB(req, res) {

  var comment = new Comment(req.body);
  try {
    doc = await comment.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

router.get('/getCommentsByPostId/:id',function(req,res){
  console.log(req.params.id)
  Comment.find({postId: req.params.id}).exec(function (err, comments) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.send(comments);
    }
  });
});

module.exports = router;
