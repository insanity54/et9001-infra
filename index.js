var express = require('express');
var app = express();
var api = require('./api');
var redis = require('redis');
var red = redis.createClient();


api(red, app);

app.listen(process.env.PORT || 5000);

module.exports = app;