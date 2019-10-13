const express = require('express');
const router = express.Router();
const CommentSchema = require('../models/comment');

router.get('/getAllComments', (req, res) => {
    CommentSchema.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post('/post/comment', (req, res) => {
    let commentModel = new CommentSchema();
    const { comment, username, parent_comment_id } = req.body;
  
    if (!comment || !username) {
      return res.json({
        success: false,
        error: 'INVALID INPUTS',
      });
    }
    commentModel.comment = comment;
    commentModel.username = username;
    commentModel.parent_comment_id = parent_comment_id;
    commentModel.save((err,comment) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({success: true , comment : comment});
    });
});

router.post('/edit/comment', (req, res) => {
    const { commentObj } = req.body;
  
    if (!commentObj) {
      return res.json({
        success: false,
        error: 'INVALID INPUTS',
      });
    }
    CommentSchema.findByIdAndUpdate(commentObj._id, commentObj, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

router.post('/reply/comment', (req, res) => {
    let commentModel = new CommentSchema();
    const { commentObj } = req.body;
  
    if (!commentObj.comment || !commentObj.username) {
      return res.json({
        success: false,
        error: 'INVALID INPUTS',
      });
    }
    commentModel.comment = commentObj.comment;
    commentModel.username = commentObj.username;
    commentModel.parent_comment_id = commentObj.parent_comment_id;
    commentModel.save((err,comment) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({success: true , comment : comment});
    });
});

module.exports = router;