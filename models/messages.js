const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

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

MessageSchema
.virtual('date_formatted')
.get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);