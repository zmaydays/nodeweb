'use strict'

var mongoose = require('mongoose')
var Blog = mongoose.model('Blog')
var BlogCategory = mongoose.model('BlogCategory')

// 首页
exports.index = function (req, res) {
  res.render('blog/index', {
    title: 'maydays 个人小站'
  })
}
//博客首页
exports.blog = function (req, res) {
  var p = parseInt(req.query.p);
  if (!p) {
    p = 0;
  } else if (p <= 0) {
    p = 0;
  }
  console.log(p);
  var index = p * 2;
  Blog.find({})
    .populate('null', 'name')
    .sort({
      '_id': -1
    })
    .limit(4)
    .skip(index)
    .exec(function (err, blogs) {
      if (err) {
        console.log(err)
      }
      if(blogs.length==0) {
       res.redirect('/blog?p=0')
      }
      res.render('blog/blog', {
        title: '博客页',
        blogs: blogs,
        logo: 'blog',
        index: index
      })
    })
}

// search page
exports.search = function (req, res) {
  var catId = req.query.cat
  var q = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  var count = 2
  var index = page * count

  if (catId) {
    BlogCategory
      .find({
        _id: catId
      })
      .populate({
        path: 'blog',
        select: 'title poster'
      })
      .exec(function (err, categories) {
        if (err) {
          console.log(err)
        }
        var category = categories[0] || {}
        var blogs = category.blog || []
        var results = blogs.slice(index, index + count)

        res.render('blog/blog_results', {
          title: 'imooc 结果列表页面',
          logo: 'blog',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(blogs.length / count),
          blogs: results
        })
      })
  } else {
    Blog
      .find({
        title: new RegExp(q + '.*', 'i')
      })
      .exec(function (err, blogs) {
        if (err) {
          console.log(err)
        }
        var results = blogs.slice(index, index + count)

        res.render('blog/blog_results', {
          title: '结果列表页面',
          logo: 'blog',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(blogs.length / count),
          blogs: results
        })
      })
  }
}