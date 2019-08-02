const express = require('express');
const app = express();
const path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/src/index.html'));
});

app.listen(process.env.PORT || 4200, function(){
    console.log('Your node js server is running');
});