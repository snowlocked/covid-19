const axios = require('axios')

axios({
  method: 'GET',
  url: 'https://covid-19-statistics.p.rapidapi.com/regions',
  headers: {
    'content-type': 'application/octet-stream',
    'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
    'x-rapidapi-key': '1aa04029edmshdcdedddc41b221ap17c136jsndcbd6b98fc63'
  }
})
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.log(error)
  })
