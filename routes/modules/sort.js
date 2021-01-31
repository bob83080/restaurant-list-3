
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')


router.get('/:type/:method', (req, res) => {
  const type = req.params.type
  const method = req.params.method
  const typeObj = { name: '店名', category: '類別', rating: '評分' }
  const methodObj = { asc: 'A-Z', desc: 'Z-A', descending: '由高至低', ascending: '由低至高' }
  const currentSelected = `${typeObj[type]}：${methodObj[method]}`
  Restaurant.find()
    .lean()
    .sort({ [type]: [method] })
    .then(restaurant => res.render('index', { restaurant, currentSelected }))
    .catch(err => console.log(err))
})

module.exports = router