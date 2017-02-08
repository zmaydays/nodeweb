var mongoose = require('mongoose')
var BlogCategory = mongoose.model('BlogCategory')

// blogadmin new page
exports.new = function(req, res) {
  res.render('blog/blog_category_admin', {
    title: 'imooc 后台分类录入页',
    logo: 'blog',
    blogCategory: {}
  })
}

// blogadmin post movie
exports.save = function(req, res) {
  var _blogCategory = req.body.blogCategory
  var blogCategory = new BlogCategory(_blogCategory)

  blogCategory.save(function(err, blogCategory) {
    if (err) {
      console.log(err)
    }

    res.redirect('/admin/blogCategory/list')
  })
}

// blogCatelist page
exports.list = function(req, res) {
  BlogCategory.fetch(function(err, blogCatetories) {
    if (err) {
      console.log(err)
    }

    res.render('blog/blog_categorylist', {
      title: '博客分类列表页',
      logo: 'blog',
      blogCatetories: blogCatetories
    })
  })
}