if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const campgrounds = require('./routes/camgrounds')
const reviewRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/user')

const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo')

// For Local Enviroment
// Prev Code:
// const dbUrl = 'mongodb://localhost:27017/campHaven'

// const dbUrl = 'mongodb://127.0.0.1:27017/campHaven'
// New code:

// For production
const dbUrl = process.env.DBURL2

mongoose
  .connect(dbUrl, {
    // Add these options for better error handling
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB.')
  })
  .catch((err) => {
    console.error('MongoDB connection error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
    })
    process.exit(1)
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
app.use(express.static(path.join(__dirname, 'public')))

console.log('before Store')
const store = MongoStore.create({
  mongoUrl: dbUrl,
  // Refresh after 1 day
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: 'Mysecret!',
  },
})

store.on('error', function (e) {
  console.log('Session Store Error')
})

const sessionConfig = {
  store,
  name: 'session',
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httOnly: true,
    expires: Date.now() + 1000 * 3600 * 24,
    maxAge: 1000 * 3600 * 24,
  },
}

console.log(session)
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(mongoSanitize())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  console.log(req.query)
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// name _method does not work
app.use(methodOverride('_method'))
app.use('/', usersRoutes)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
  res.render('home')
})

//Back up error
app.all('*', (req, res, next) => {
  next(new ExpressError('page not found!', 404))
})

// basic error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'OH no something went wrong'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})
