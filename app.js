const express = require('express')
const app = express()
const restaurantList = require('./restaurant.json')
const exphbs = require('express-handlebars')
const port = 3000



app.engine('handlebars', exphbs({ defaultLayouts: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))


app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const movies = movieList.results.filter((movie) => {
    return movie.title.toLowerCase().includes(req.query.keyword.toLowerCase())
  })
  res.render('index', { movies: movies, keyword: req.query.keyword })
})

app.get('/movies/:movie_id', (req, res) => {
  const movie = movieList.results.filter(movie => movie.id == req.params.movie_id)
  res.render('show', { movie: movie[0] })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost: ${port}`)
})