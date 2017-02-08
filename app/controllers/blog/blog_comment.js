var mongoose = require('mongoose')
var BlogComment = mongoose.model('BlogComment')

// comment
exports.save = function(req, res) {
  var _blogComment = req.body.comment
  var blogId = _blogComment.blog

  if (_blogComment.cid) {
    BlogComment.findById(_blogComment.cid, function(err, blogComment) {
      var reply = {
        from: _blogComment.from,
        to: _blogComment.tid,
        content: _blogComment.content
      }
 
      blogComment.reply.push(reply)

      blogComment.save(function(err, blogComment) {
        if (err) {
          console.log(err)
        }

        res.redirect('/blog/' + blogId)
      })
    })
  }
  else {
    var blogComment = new BlogComment(_blogComment)

    blogComment.save(function(err, blogComment) {
      if (err) {
        console.log(err)
      }

      res.redirect('/blog/' + blogId)
    })
  }
}