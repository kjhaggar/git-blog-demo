var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var cors = require("cors");
db = require("./config/db");
var indexRouter = require("./routes/index");
require("./passport-config");
var session = require("express-session");
var multer = require("multer");
const mongoose = require("mongoose");
var crypto = require("crypto");
var nodemailer = require("nodemailer");

var app = express();

var imgDir = require("path").join(__dirname, "/static");
app.use(express.static(imgDir));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "qwerty@170397",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var originsWhitelist = ["http://localhost:4200", "http://127.0.0.1:4200"];
// var originsWhitelist = [ 'https://demo-blogging-application.herokuapp.com'];
var corsOptions = {
  origin: function(origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));

app.get("/", function(req, res) {
  res.send("App is Running");
});

app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
