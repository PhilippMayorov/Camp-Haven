const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')

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

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))

// name _method does not work
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

app.get('/makeCampGround', async (req, res) => {
  const camp = new Campground({ title: 'My Back yard', price: 40 })
  await camp.save()
  res.send(camp)
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
  } catch (e) {
    next(e)
  }
})

app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground })
})

app.post('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  })
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  await Campground.deleteOne({ _id: id })
  res.redirect('/campgrounds')
})

// basic error handler
app.use((err, req, res, next) => {
  res.send('somthing went wrong')
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})
