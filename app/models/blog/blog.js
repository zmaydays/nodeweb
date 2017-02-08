'use strict';

var mongoose = require('mongoose'),
    BlogSchema = require('../../schemas/blog/blog');

module.exports = mongoose.model('Blog', BlogSchema);