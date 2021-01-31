const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const routes = require('./routes')

require('./config/mongoose')

// --------路由設定-------- //

app.engine('handlebars', exphbs({ defaultLayouts: 'main' }))
app.set('view engine', 'handlebars')
app.use((bodyParser.urlencoded({ extended: true })))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)


app.listen(port, () => {
  console.log(`Express is listening on localhost: ${port}`)
})