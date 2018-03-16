const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios');
const moment = require('moment');

const app = express()

let corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

app.use(cors(corsOption));

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

let data = {
  coinList: {},
  prices: {}
}

let priceCounter = 0
let fsym

const getCoinListTimer = setInterval(() => {
  getCoinList()
}, 30 * 60 * 1000); // Calls every 30 minutes

getCoinList().then(() => {
  const getPricesTimer = setInterval(() => {
    fsym = Object.keys(data['coinList']['Data'])[priceCounter]
    getPrices(fsym)

    if(priceCounter === Object.keys(data['coinList']['Data']).length - 1) {
      console.log('coinList: ', priceCounter, '\nprices: ', Object.keys(data['prices']).length, '\nlast: ', fsym, '\ntime: ', moment().format('MMMM Do YYYY, h:mm:ss a'), '\n-------\n')
      priceCounter = 0
    } else {
      priceCounter++
    }
  }, 25); // Calls 45 per second

  // for (let fsym of Object.keys(data['coinList']['Data'])) {
  // }
})


function getCoinList() {
  const coinListUrl = 'https://min-api.cryptocompare.com/data/all/coinlist'

  return axios.get(coinListUrl)
    .then(function (response) {
      data['coinList'] = response['data']
      data['coinList']['lastUpdated'] = moment().format('MMMM Do YYYY, h:mm:ss a')
    })
    .catch(function (response) {
      console.log(response)
    })
}

function getPrices(fsym) {
  let pricesUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + fsym + '&tsyms=BTC,USD,EUR'

  return axios.get(pricesUrl)
    .then(function (response) {
      data['prices'][fsym] = response['data']
      data['prices'][fsym]['lastUpdated'] = moment().format('MMMM Do YYYY, h:mm:ss a')
    })
    .catch(function (response) {
      console.log(response)
    })
}
app.get('/', function (req, res) {
  res.send(data)
})

app.listen(3001)