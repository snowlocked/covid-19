const axios = require('axios')
const urlData = require('./keysDataUrl.json')
const fs = require('fs')
const continentColor = {
  亚洲: '#f00',
  非洲: '#000',
  欧洲: '#0f0',
  大洋洲: '#00f',
  南美洲: '#0ff',
  北美洲: '#f0f'
}

const resolvePath = (file) => `${__dirname}/${file}`

const write = (data, fileName) => {
  fs.writeFile(resolvePath(fileName), JSON.stringify(data), 'utf8', function (error) {
    if (error) {
      console.log(error)
      return false
    }
    console.log(`写入${fileName}成功`)
  })
}

const setDate = (date) => {
  date += ''
  const year = date.substring(0, 4)
  const month = date.substring(4, 6)
  const day = date.substring(6)
  return `${year}-${month}-${day}`
}

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
  write(data, 'data.json')
  const totalConfirmData = data.reduce((pre, countryData) => {
    return pre.concat(countryData.timeline.map((item) => {
      return {
        value: item.confirmedCount,
        name: countryData.country,
        color: continentColor[countryData.continent],
        date: setDate(item.dateId)
      }
    }))
  }, [])
  write(totalConfirmData, 'totalConfirmData.json')
  const deathRate = data.reduce((pre, countryData) => {
    return pre.concat(countryData.timeline.filter(item => item.curedCount + item.deadCount > 999).map(item => {
      return {
        value: ((item.deadCount / (item.curedCount + item.deadCount)) * 100).toFixed(4),
        name: countryData.country,
        color: continentColor[countryData.continent],
        date: setDate(item.dateId)
      }
    }))
  }, [])
  write(deathRate, 'deathRate.json')
  const death = data.reduce((pre, countryData) => {
    return pre.concat(countryData.timeline.map((item) => {
      return {
        value: item.deadCount,
        name: countryData.country,
        color: continentColor[countryData.continent],
        date: setDate(item.dateId)
      }
    }))
  }, [])
  write(death, 'death.json')
})
