'use strict'
var mongoose = require('mongoose')
var BlogCategorySchema = require('../../schemas/blog/blog_category')
var BlogCategory = mongoose.model('BlogCategory', BlogCategorySchema)

module.exports = BlogCategory