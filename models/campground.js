const mongoose = require('mongoose')
const { campgroundSchema } = require('../schemas')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.ObjectId,
      ref: 'review',
    },
  ],
})

CampgroundSchema.post('findOneAndDelete', async function () {
  console.log('DELETED!')
})

module.exports = mongoose.model('campground', CampgroundSchema)
