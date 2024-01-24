const mongoose = require('mongoose')
const { schema } = require('./campground')
const Schema = mongoose.Schema

const review = new Schema({
  body: String,
  rating: Number,
})

module.export = mongoose.modoel('Review', review)
