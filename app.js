const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./models/restaurant')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const db = mongoose.connection
const Restaurant = require('./models/restaurant')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', () => { console.log('mongodb error!') })
db.once('open', () => { console.log('mongodb connected!') })

// --------路由設定-------- //

app.engine('handlebars', exphbs({ defaultLayouts: 'main' }))
app.set('view engine', 'handlebars')
app.use((bodyParser.urlencoded({ extended: true })))
app.use(express.static('public'))

// --------主頁-------- //

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

// --------搜尋-------- //
// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword.trim()
//   const restaurants = restaurantList.filter(item => {
//     return item.category.includes(keyword) ||
//       item.name.toLowerCase().includes(keyword.toLowerCase())
//   })
//   if (restaurants.length === 0) {
//     res.render('notfound')
//   } else {
//     res.render('index', { restaurant: restaurants, keyword })
//   }
// })

app.get('/search', (req, res) => {
  const keyword = req.query.keyword

  return Restaurant.find() // 取出 Restaurant model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => {

      const restaurant = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()))
      console.log(restaurant)
      res.render('index', { restaurant })
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword.trim()
//   const restaurants = restaurantList.filter(item => { return item.name.toLowerCase().includes(req.query.keyword.toLowerCase()) || item.category.toLowerCase().includes(keyword.toLowerCase()) })
//   res.render('index', { restaurant: restaurants, keyword })
// })

// --------細節頁面-------- //
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// --------生產新頁面-------- //
app.get('/new', (req, res) => {
  return res.render('new')
})

app.post('/', (req, res) => {
  if (req.body.image.length === 0) { req.body.image = 'https://www.teknozeka.com/wp-content/uploads/2020/03/wp-header-logo-33.png' }
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// --------修改頁面-------- //
app.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', restaurant))
    .catch(error => console.log(error))
})

// --------更新頁面-------- //
app.post('/:id/edit/update', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = req.body.name
      restaurant.category = req.body.category
      restaurant.image = req.body.image
      restaurant.loction = req.body.location
      restaurant.phone = req.body.phone
      restaurant.rating = req.body.rating
      restaurant.google_map = req.body.google_map
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})
// --------刪除頁面-------- //
app.post('/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`Express is listening on localhost: ${port}`)
})