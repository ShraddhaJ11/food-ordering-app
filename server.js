const express = require('express');
const restaurants = require('./restaurants.json');
const cors = require('cors');

const PORT = 4000;
const app = express();
app.use(cors())

app.get('/restaurants', (req, res) => {
  res.send(restaurants.restaurants);
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})