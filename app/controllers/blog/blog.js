var mongoose = require('mongoose')
var Blog = mongoose.model('Blog')
var BlogCategory = mongoose.model('BlogCategory')
var BlogComment = mongoose.model('BlogComment')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')


//博客首页
exports.tag = function (req, res) {
  BlogCategory
    .find({})
    .populate({
      path: 'blog',
      select: 'title poster',
      options: {
        limit: 6
      }
    })
    .exec(function (err, blogCategories) {
      if (err) {
        console.log(err)
      }

      res.render('blog/blog_tag', {
        title: 'imooc 首页',
        logo: 'blog',
        blogCategories: blogCategories
      })
    })
}

// detail page
exports.detail = function(req, res) {
  var id = req.params.id

  Blog.update({_id: id}, {$inc: {pv: 1}}, function(err) {
    if (err) {
      console.log(err)
    }
  })

  Blog.findById(id, function(err, blog) {
    BlogComment
      .find({blog: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, blogComments) {
        res.render('blog/blog_detail', {
          title: 'imooc 详情页',
          logo: 'blog',
          blog: blog,
          blogComments: blogComments
        })
      })
  })
}

// admin new page
exports.new = function(req, res) {
  BlogCategory.find({}, function(err, blogCategories) {
    res.render('blog/blog_admin', {
      title: 'imooc 后台录入页',
      logo:'blog',
      blogCategories: blogCategories,
      blog: {}
    })
  })
}

// admin update page
exports.update = function(req, res) {
  var id = req.params.id

  if (id) {
    Blog.findById(id, function(err, blog) {
      BlogCategory.find({}, function(err, blogCategories) {
        res.render('blog/blog_admin', {
          title: '博客数据更新页',
          blog: blog,
          logo: 'blog',
          blogCategories: blogCategories
        })
      })
    })
  }
}

// admin post blog
exports.save = function(req, res) {
  var id = req.body.blog._id
  var blogObj = req.body.blog
  var _blog

  if (req.poster) {
    blogObj.poster = req.poster
  }

  if (id) {
    Blog.findById(id, function(err, blog) {
      if (err) {
        console.log(err)
      }

      _blog = _.extend(blog, blogObj)
      _blog.save(function(err, blog) {
        if (err) {
          console.log(err)
        }

        res.redirect('/blog/' + blog._id)
      })
    })
  }
  else {
    _blog = new Blog(blogObj)

    var blogCategoryId = blogObj.blogCategory
    var blogCategoryName = blogObj.blogCategoryName

    _blog.save(function(err, blog) {
      if (err) {
        console.log(err)
      }
      if (blogCategoryId) {
        BlogCategory.findById(blogCategoryId, function(err, blogCategory) {
          console.log(blogCategory.blog)
          blogCategory.blog.push(blog._id)

          blogCategory.save(function(err, blogCategory) {
            res.redirect('/blog/' + blog._id)
          })
        })
      }
      else if (blogCategoryName) {
        var blogCategory = new BlogCategory({
          name: blogCategoryName,
          blogs: [blog._id]
        })

        blogCategory.save(function(err, blogCategory) {
          blog.blogCategory = blogCategory._id
          blog.save(function(err, blog) {
            res.redirect('/blog/' + blog._id)
          })
        })
      }
    })
  }
}

// list page
exports.list = function(req, res) {
  Blog.find({})
    .populate('blogCategory', 'name')
    .exec(function(err, blogs) {
      if (err) {
        console.log(err)
      }

      res.render('blog/blog_list', {
        title: '博客列表页',
        blogs: blogs,
        logo: 'blog'
      })
    })
}

// list page
exports.del = function(req, res) {
  var id = req.query.id

  if (id) {
    Blog.remove({_id: id}, function(err, blog) {
      if (err) {
        console.log(err)
        res.json({success: 0})
      }
      else {
        res.json({success: 1})
      }
    })
  }
}