const axios = require('axios')
const urlData = require('./keysDataUrl.json')
const fs = require('fs')

const resolvePath = (file) => `${__dirname}/${file}`

const data = []
const allPromise = Object.keys(urlData)
  .filter(key => urlData[key].statisticsData)
  .map(key => axios.get(urlData[key].statisticsData).then(res => {
    return {
      timeline: res.data.data,
      country: key,
      countryEn: urlData[key].countryEnglishName,
      continent: urlData[key].continent
    }
  }))

Promise.all(allPromise).then(res => {
  res.forEach(r => {
    data.push(r)
  })
  fs.writeFile(resolvePath('data.json'), JSON.stringify(data), 'utf8', function (error) {
    if (error) {
      console.log(error)
      return false
    }
    console.log('写入data.json成功')
  })
})
