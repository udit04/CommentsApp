const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    comment: String,
    parent_comment_id: String,
    username : String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", Comment);