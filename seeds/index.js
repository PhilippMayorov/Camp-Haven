const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

mongoose
  .connect('mongodb://localhost:27017/campHaven')
  .then(() => {
    console.log('MONGO: Connection Open!')
  })
  .catch((er) => {
    console.log('ERROR')
    console.log(er)
  })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('once', () => {
  console.log('DataBase Connected!')
})

const sample = (array) => Math.floor(Math.random() * array.length)

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 100; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.floor(Math.random() * 20) + 10)
    const location = `${cities[random1000].city}, ${cities[random1000].state}`

    const camp = new Campground({
      //Test author
      author: '65c13d27691b711e3ecd3803',

      location: location,
      title: `${descriptors[sample(descriptors)]} ${places[sample(places)]}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero asperiores dolorum cumque. Sequi, aspernatur magnam quibusdam dicta non pariatur illum optio nesciunt porro quas quos at quidem, exercitationem praesentium numquam.',
      price: price,

      // For now using fake data to not overload API
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/duofogphb/image/upload/e_improve:outdoor/campHaven/u7h5e9v2sbzgjrilqv3d.jpg',
          filename: 'campHaven/u7h5e9v2sbzgjrilqv3d',
        },
        {
          url: 'https://res.cloudinary.com/duofogphb/image/upload/v1707680560/campHaven/oaxmt7icrtzfv6eerwsm.jpg',
          filename: 'campHaven/oaxmt7icrtzfv6eerwsm',
        },
      ],
    })
    console.log(camp)
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
