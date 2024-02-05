const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
})

// adding passport and username Plugins
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', UserSchema)
