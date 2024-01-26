const mongoose = require('mongoose')
const Schema = mongoose.Schema

const camgroundsSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.ObjectId,
      ref: 'Review',
    },
  ],
})

module.exports = mongoose.model('campground', camgroundsSchema)
