'use strict'
var mongoose = require('mongoose')
var BlogCommentSchema = require('../../schemas/blog/blog_comment');
var BlogComment = mongoose.model('BlogComment', BlogCommentSchema)

module.exports = BlogComment