const express = require('express')
const { engine } = require('express-handlebars')
const app = express() 
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results
const BASE_IMG_URL = 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/'

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.redirect('/restaurants')
})


app.get('/restaurants', (req, res) => {
  res.render('index', { restaurants, BASE_IMG_URL })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword?.trim()
  const matchedRestaurants = keyword ? restaurants.filter((re) =>
    Object.values(re).some((property) => {
      if (typeof property === 'string') {
        return property.toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })
  ) : restaurants
  res.render('index', { restaurants: matchedRestaurants, BASE_IMG_URL, keyword })
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((re) => re.id.toString() === id)
  res.render('detail', { restaurant, BASE_IMG_URL })
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})