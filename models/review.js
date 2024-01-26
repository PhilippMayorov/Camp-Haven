const mongoose = require('mongoose')
const { schema } = require('./campground')
const Schema = mongoose.Schema

const review = new Schema({
  rating: Number,
  body: String,
})

module.exports = mongoose.model('review', review)
