const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    message:{type:String, required:true},
    userName:{type: Schema.Types.ObjectId, ref: 'User', required:true},
    date:{type:Date, default:Date.now, required:true}
  }
);

// Virtual for Messages s URL
MessageSchema
.virtual('url')
.get(function () {
  return '/messages/' + this._id;
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);