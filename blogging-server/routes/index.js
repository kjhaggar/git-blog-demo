var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Post = require("../models/addPost");
var Request = require("../models/FriendRequest");
var Notify = require("../models/newTagNotify");
var jwt = require("jsonwebtoken");
var multer = require("multer");

router.post("/register", function(req, res, next) {
  addToDB(req, res);
});

async function addToDB(req, res) {
  var user = new User({
    email: req.body.email,
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: User.hashPassword(req.body.password)
  });

  try {
    doc = await user.save();
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(501).json(err);
  }
}

router.post("/socialRegister", function(req, res, next) {
  addToSocialDB(req, res);
});

function addToSocialDB(req, res) {
  User.find({ email: req.body.email }).exec(function(err, user) {
    if (err) {
      console.log("Error:", err);
    } else {
      if (user.length!=0) {
        console.log(user)
        res.json({
          success: "false",
          message: "User already registered with this email"
        });
      } else {
        var splitted = req.body.name.split(" ", 2);
        var user = new User({
          firstName: splitted[0],
          lastName: splitted[1],
          email: req.body.email,
          provider_pic: req.body.image
        });
        try {
          doc = user.save();
          console.log(doc)
          return res.status(201).json(doc);
        } catch (err) {
          return res.status(501).json(err);
        }
      }
    }
  });
}

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorised request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token == "null") {
    return res.status(401).send("Unauthorised request. No token found");
  }
  let payload = jwt.verify(token, "qwerty@12345");
  if (!payload) {
    return res.status(401).send("Unauthorised request (!payload)");
  }
  req.userId = payload.subject;
  next();
}

router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user) {
    if (err) {
      return res
        .status(501)
        .json({ err, success: false, message: "Unable To login." });
    }
    if (!user) {
      return res
        .status(501)
        .json({ success: false, message: "Username or password is incorrect..!!" });
    }
    const token = jwt.sign({ id: user._id }, "qwerty@12345", {
      expiresIn: 86400
    });
    req.logIn(user, function(err) {
      if (err) {
        return res.status(501).json(err);
      }
      return res.status(200).json({
        token: token,
        userId: user._id,
        userName: user.userName
      });
    });
  })(req, res, next);
});

router.post("/socialLogin", function(req, res, next) {
  User.find({ email: req.body.email }).exec(function(err, userData) {
    if (err) {
      return res.status(501).json({ err, success: false, message: "Unable To login." });
    }
    if (!userData) {
      return res.status(501).json({ success: false, message: "Not the registered user" });
    }
    res.json(userData);
  });
});

router.post("/sendRequest", verifyToken, function(req, res, next) {
  var newRequest = new Request({
    user: req.body.senderId,
    requestTo: req.body.receiverId
  });
  newRequest.save(err => {
    if (err) {
      res.json({ success: false, message: "Something went wrong." });
    } else {
      res.json({ success: true, message: "Saved" });
    }
  });
});

router.post("/storeTaggedUsers", function(req, res, next) {
  var notify = new Notify({
    typeOfMsg: req.body.type,
    postId: req.body.postId
  });

  for (var i = 0; i < req.body.users.length; i++) {
    notify.taggedUsers.push({
      userName: req.body.users[i]
    });
  }

  notify.taggedBy.name = req.body.name;
  notify.taggedBy.id = req.body.id;

  notify.save(err => {
    if (err) {
      res.json({ success: false, message: "Something went wrong." });
    } else {
      res.json({ success: true, message: "Saved" });
    }
  });
});
router.put("/changePostStatus", function(req, res, next) {
  Notify.findByIdAndUpdate({ _id: req.body.blogIdList }).exec(function(
    err,
    blog
  ) {
    if (err) {
      console.log("Error:", err);
    } else {
      blog.taggedUsers.forEach(function(item) {
        if (item.userName === req.body.userName) item.read = true;
      });
      try {
        doc = blog.save();
        res.status(201).json(blog);
      } catch (err) {
        return res.status(501).json(err);
      }
    }
  });
});

router.put("/acceptFriendRequest", function(req, res, next) {
  User.findOne({ _id: req.body.userId }, (err, user) => {
    if (err) {
      res.json({ success: false, message: "Invalid user id" });
    } else {
      if (!user) {
        res.json({ success: false, message: "User not found." });
      } else {
        user.friends.push({
          friendName: req.body.friendUserName,
          friendId: req.body.friendId
        });

        var notify = new Notify({
          typeOfMsg: "acceptRequest",
          userId: req.body.userId,
          userName: req.body.userName,
          friendId: req.body.friendId,
          friendName: req.body.friendUserName
        });
        notify.save();
        user.save(err => {
          if (err) {
            res.json({ success: false, message: "Something went wrong." });
          } else {
            res.json({ success: true, message: "New Friend Added" });
          }
        });
      }
    }
  });
});

router.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "https://demo-blogging-application.herokuapp.com");
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var blogStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "../blogging-server/static/blogImages");
    // cb(null, 'static/blogImages')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  }
});

var blogImagesUpload = multer({ storage: blogStorage });

router.post("/addPost", blogImagesUpload.array("uploads[]", 12), function(
  req,
  res,
  next
) {
  var blogData = JSON.parse(req.body.forminput);
  var imgUrl = req.files.map(file => {
    return {
      filename: file.filename
    };
  });
  const blog = new Post({
    userId: blogData.userId,
    userName: blogData.userName,
    title: blogData.title,
    description: blogData.description,
    imageUrl: imgUrl
  });
  try {
    doc = blog.save();
    return res.status(201).json(blog);
  } catch (err) {
    return res.status(501).json(err);
  }
});

router.put("/updatePost/:id", blogImagesUpload.array("uploads[]", 12), function(
  req,
  res,
  next
) {
  Post.findOne({ _id: req.params.id }, function(err, post) {
    if (err) {
      res.json({ success: false, message: "Something went wrong" });
    } else {
      if (!post) {
        res.json({ success: false, message: "Post not found." });
      } else {
        var updatedDetails = JSON.parse(req.body.forminput);
        if (req.files) {
          var imgUrl = req.files.map(file => {
            return file.filename;
          });
          if (imgUrl != null) {
            imgUrl.forEach(element => {
              post.imageUrl.push({ filename: element });
            });
            imgUrl = [];
          }
        }
        post.description = updatedDetails;

        post.save(err => {
          if (err) {
            res.json({ success: false, message: "Something went wrong." });
          } else {
            res.json(post);
          }
        });
      }
    }
  });
});

router.delete("/deletePost/:id", function(req, res, next) {
  Post.findByIdAndRemove(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "../blogging-server/static/images");
    // cb(null, 'static/images')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

var upload = multer({ storage: storage });

router.put("/uploadData/:id", upload.single("image"), function(req, res, next) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      res.json({ success: false, message: "Something went wrong" });
    } else {
      if (!user) {
        res.json({ success: false, message: "User not found." });
      } else {
        var updatedDetails = JSON.parse(req.body.forminput);
        if (req.file) {
          var imgUrl = req.file.filename;
          user.image = imgUrl;
        }
        user.userName = updatedDetails.userName;
        user.firstName = updatedDetails.firstName;
        user.lastName = updatedDetails.lastName;

        if (updatedDetails.password != null) {
          user.password = User.hashPassword(updatedDetails.password);
        }

        user.save(err => {
          if (err) {
            res.json({ success: false, message: "Something went wrong." });
          } else {
            res.json({ success: true, message: "Profile updated..!!" });
          }
        });
      }
    }
  });
});

router.get("/displayProfilePicture", function(req, res) {
  User.find({})
    .select("image userName")
    .exec(function(err, user) {
      if (err) {
        console.log("Error:", err);
      } else {
        res.json(user);
      }
    });
});

router.get("/allPost", function(req, res) {
  Post.find({}).exec(function(err, posts) {
    if (err) {
      console.log("Error:", err);
    } else {
      res.send(posts);
    }
  });
});

router.get("/getPostById/:id", function(req, res) {
  Post.find({ userId: req.params.id }).exec(function(err, posts) {
    if (err) {
      console.log("Error:", err);
    } else {
      res.send(posts);
    }
  });
});

router.get("/getBlogById/:id", function(req, res) {
  Post.find({ _id: req.params.id }).exec(function(err, post) {
    if (err) {
      console.log("Error:", err);
    } else {
      res.send(post);
    }
  });
});

router.post("/addComment", function(req, res, next) {
  addToCommentDB(req, res);
});

async function addToCommentDB(req, res) {
  Post.findOne({ _id: req.body.postId }, (err, post) => {
    if (err) {
      res.json({ success: false, message: "Invalid post id" });
    } else {
      if (!post) {
        res.json({ success: false, message: "post not found." });
      } else {
        post.comments.push({
          content: req.body.comment,
          commenterId: req.body.userId,
          commenterName: req.body.userName
        });
        post.save(err => {
          if (err) {
            res.json({ success: false, message: "Something went wrong." });
          } else {
            res.json({ success: true, message: "Comment saved" });
          }
        });
      }
    }
  });
}

router.delete("/deleteComment", function(req, res, next) {
  Post.update(
    { _id: req.body.postId },
    { $pull: { comments: { _id: req.body.commentId } } },
    function(err, blog) {
      if (err) {
        return next(err);
      } else {
        res.json(blog);
      }
    }
  );
});

router.delete("/deleteReply", function(req, res, next) {
  Post.update(
    { _id: req.body.postId, "comments._id": req.body.commentId },
    { $pull: { "comments.$.replies": { _id: req.body.replyId } } },
    function(err, blog) {
      if (err) {
        return next(err);
      } else {
        res.json(blog);
      }
    }
  );
});

router.post("/addReply", function(req, res, next) {
  addToReplyDB(req, res);
});

async function addToReplyDB(req, res) {
  Post.findOne({ _id: req.body.postId }, (err, post) => {
    if (err) {
      res.json({ success: false, message: "Invalid post id" });
    } else {
      if (!post) {
        res.json({ success: false, message: "post not found." });
      } else {
        post.comments.id({ _id: req.body.commentId }).replies.push({
          content: req.body.content,
          commenterId: req.body.userId,
          commenterName: req.body.userName
        });
        post.save(err => {
          if (err) {
            res.json({ success: false, message: "Something went wrong." });
          } else {
            res.json({ success: true, message: "Comment saved" });
          }
        });
      }
    }
  });
}

router.get("/getProfileData/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).exec((err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      if (!user) {
        res.json({ success: false, message: "User not found" });
      } else {
        res.json(user);
      }
    }
  });
});

router.delete("/deleteProfilePicture/:id", function(req, res, next) {
  User.update({ _id: req.params.id }, { $unset: { image: 1,  provider_pic: 1 } }, function(
    err,
    post
  ) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete("/deleteBlogImage", function(req, res, next) {
  Post.update(
    { _id: req.body.postId },
    { $pull: { imageUrl: { _id: req.body.imageId } } },
    function(err, blog) {
      if (err) {
        return next(err);
      } else {
        res.json(blog);
      }
    }
  );
});

router.get("/getUsersList", function(req, res) {
  User.find({}).exec(function(err, user) {
    if (err) {
      console.log("Error:", err);
    } else {
      res.json(user);
    }
  });
});

router.get("/requestList/:id", function(req, res) {
  Request.find({ requestTo: req.params.id, status: "false" }).exec(function(
    err,
    request
  ) {
    if (err) {
      console.log("Error:", err);
    } else {
      var pendingRequestId = request.map(({ user }) => user);
      User.find({ _id: { $in: pendingRequestId } }).exec(function(
        err,
        pendingUserProfile
      ) {
        if (err) {
          console.log("Error:", err);
        } else {
          res.send({ pendingUserProfile, pendingRequestId, request });
        }
      });
    }
  });
});

router.get("/sentRequestList/:id", function(req, res) {
  Request.find({ user: req.params.id, status: "false" }).exec(function(
    err,
    request
  ) {
    if (err) {
      console.log("Error:", err);
    } else {
      var pendingRequestId = request.map(({ requestTo }) => requestTo);
      res.send(pendingRequestId);
    }
  });
});

router.get("/friendsList/:id", function(req, res) {
  User.findOne({ _id: req.params.id }).exec(function(err, user) {
    if (err) {
      console.log("Error:", err);
    } else {
      var friendsId = user.friends.map(({ friendId }) => friendId);
      User.find({ _id: { $in: friendsId } }).exec(function(err, friendList) {
        if (err) {
          console.log("Error:", err);
        } else {
          res.send(friendList);
        }
      });
    }
  });
});

router.put("/changeRequestStatus", function(req, res, next) {
  Request.findOneAndUpdate({
    user: req.body.friend,
    requestTo: req.body.user
  }).exec(function(err, request) {
    if (err) {
      console.log("Error:", err);
    } else {
      request.status = "true";
      request.save(err => {
        if (err) {
          res.json({ success: false, message: "Something went wrong." });
        } else {
          res.send(request);
        }
      });
    }
  });
});

router.put("/changePendingRequestStatus/:id", function(req, res, next) {
  Request.update(
    { requestTo: req.params.id, status: "false" },
    { $set: { read: "true" } },
    { multi: true }
  ).exec(function(err, request) {
    if (err) {
      console.log("Error:", err);
    }
    res.json(request);
  });
});

router.get("/getNotified/:userName", function(req, res) {
  Notify.find({
    $or: [
      { "taggedUsers.userName": req.params.userName },
      { userName: req.params.userName }
    ]
  }).exec(function(err, msg) {
    if (err) {
      console.log("Error:", err);
    }
    res.send(msg);
  });
});

router.get("/publicBlog/:userName/:userId", function(req, res) {
  Notify.find({ "taggedUsers.userName": req.params.userName }).exec(function(
    err,
    friendsBlog
  ) {
    if (err) {
      console.log("Error:", err);
    } else {
      const postId = [];
      friendsBlog.forEach(element => {
        if (element.typeOfMsg == "taggedOnBlog") {
          postId.push(element.postId);
        }
      });
      Post.find({
        $or: [{ _id: { $in: postId } }, { userId: req.params.userId }]
      }).exec(function(err, blog) {
        if (err) {
          console.log("Error:", err);
        } else {
          res.send(blog);
        }
      });
    }
  });
});

router.delete("/deleteFriendRequest", function(req, res, next) {
  Request.findOneAndDelete({
    user: req.body.user,
    requestTo: req.body.requestTo
  }).exec(function(err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

router.delete("/cancelFriendRequest", function(req, res, next) {
  Request.findOneAndDelete({
    user: req.body.user,
    requestTo: req.body.requestTo
  }).exec(function(err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

router.get("/tagUser", function(req, res) {
  User.find({})
    .select("userName")
    .exec(function(err, user) {
      if (err) {
        console.log("Error:", err);
      } else {
        var userName = user.map(({ userName }) => userName);
        res.json({ userName, user });
      }
    });
});
module.exports = router;
