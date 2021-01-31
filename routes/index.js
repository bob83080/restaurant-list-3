const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const search = require('./modules/search')
const create = require('./modules/create')
const sort = require('./modules/sort')

router.use('/', home)
router.use('/restaurant', restaurant)
router.use('/search', search)
router.use('/new', create)
router.use('/sort', sort)




module.exports = router