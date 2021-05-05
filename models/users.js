const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true},
    password: {type: String, required: true},
    membership: {type: Boolean, required: true}
  }
);

// Virtual for User's URL
UserSchema
.virtual('url')
.get(function () {
  return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);