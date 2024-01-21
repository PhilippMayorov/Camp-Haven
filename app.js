const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const { campgroundSchema } = require('./schemas.js')

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

// Campground middleware the ensures user input correct data
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}
// name _method does not work
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post(
  '/campgrounds',
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground })
})

app.post(
  '/campgrounds/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    })
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.deleteOne({ _id: id })
    res.redirect('/campgrounds')
  })
)

//Back up error
app.all('*', (req, res, next) => {
  next(new ExpressError('page not found!', 404))
})

// basic error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'something went wrong' } = err
  if (!err.message) err.message = 'OH no something went wrong'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})
