const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground} = require('../middleware')

// Campground middleware the ensures user input correct data


router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => 
 {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id; 
    await campground.save()
    req.flash('success', 'New Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)


router.get('/:id', async (req, res) => 
{
  const campground = await Campground.findById(req.params.id)
  //Populate each review by author
    .populate(
      { 
        path:"reviews",
        populate: 
        {
          path: "author"
        }
      }).populate("author")
      console.log(campground)
  if (!campground) {
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground })
})

router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(async (req, res) => 
{
  const {id} = req.params
  const campground = await Campground.findById(id)
  if (!campground)
  {
    req.flash("error", "Cant find that campgrounds")
    return res.redirect("/campgrounds")
  }
  // const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground })
}))

router.post('/:id', isLoggedIn,isAuthor,validateCampground,catchAsync(async (req, res) => 
  {
    const { id } = req.params
    // const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground,})
    req.flash('success', 'Succesful Update!')
    res.redirect(`/campgrounds/${campground._id}`)
  }))

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async (req, res) => 
{
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Succesfully Deleted Campground!')

  res.redirect('/campgrounds')
}))

module.exports = router
