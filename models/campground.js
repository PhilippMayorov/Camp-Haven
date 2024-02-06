const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

//Isuess is here
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: 
  {
    type: Schema.Types.ObjectId, 
    ref: "user"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    })
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
