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
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.floor(Math.random() * 20) + 10)

    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${descriptors[sample(descriptors)]} ${places[sample(places)]}`,

      image: 'https://random.imagecdn.app/1280/720',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero asperiores dolorum cumque. Sequi, aspernatur magnam quibusdam dicta non pariatur illum optio nesciunt porro quas quos at quidem, exercitationem praesentium numquam.',
      price: price,
    })
    console.log(camp)
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
