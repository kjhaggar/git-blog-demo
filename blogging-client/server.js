const express = require('express');
const app = express();
const path = require('path');

var distDir = __dirname + "/dist/blog-client/";
app.use(express.static(distDir));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/blog-client/index.html'));
});

app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});
