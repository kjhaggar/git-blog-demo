const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/blogDb" || process.env.MONGOLAB_URI, { useNewUrlParser: true });

mongoose.connection.on('connected', function (err) {
  console.log("Connected to DB Successfully");
});

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});