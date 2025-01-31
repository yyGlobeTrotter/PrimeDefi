const createRequestRating = require('./rating').createRequestRating

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || process.env.PORT || 8080

app.use(bodyParser.json())

app.post('/rating/', (req, res) => {
  console.log('POST Data: ', JSON.stringify(req.body))
  createRequestRating(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
