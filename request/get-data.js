const data = require('./data.js')
const setDate = require('./set-date.js')
const fs = require('fs')
const continentColor = {
  亚洲: '#F56C6C',
  非洲: '#303133',
  欧洲: '#67C23A',
  大洋洲: '#409EFF',
  南美洲: '#E6A23C',
  北美洲: '#E609FF'
}

const resolvePath = (file) => `${__dirname}/${file}`

const write = (data, fileName, filter = true) => {
  fs.writeFile(resolvePath(fileName), JSON.stringify(data), 'utf8', function (error) {
    if (error) {
      console.log(error)
      return false
    }
    console.log(`写入${fileName}成功`)
  })
}

const totalConfirmData = data.map(countryData => {
  return {
    value: countryData.confirmedCount,
    name: countryData.countryName,
    color: continentColor[countryData.continentName],
    date: setDate(countryData.updateTime),
    updateTime: countryData.updateTime
  }
})
write(totalConfirmData, 'totalConfirmData.json')

const deathRate = data.filter(countryData => countryData.curedCount + countryData.deadCount > 999)
  .map(countryData => {
    return {
      value: ((countryData.deadCount / (countryData.curedCount + countryData.deadCount)) * 100).toFixed(4),
      name: countryData.countryName,
      color: continentColor[countryData.continentName],
      date: setDate(countryData.updateTime),
      updateTime: countryData.updateTime
    }
  })
write(deathRate, 'deathRate.json')

const death = data.map(countryData => {
  return {
    value: countryData.deadCount,
    name: countryData.countryName,
    color: continentColor[countryData.continentName],
    date: setDate(countryData.updateTime),
    updateTime: countryData.updateTime
  }
})
write(death, 'death.json')

const deathRate2 = data.filter(countryData => countryData.confirmedCount >= 100)
  .map(countryData => {
    return {
      value: ((countryData.deadCount / countryData.confirmedCount) * 100).toFixed(4),
      name: countryData.countryName,
      color: continentColor[countryData.continentName],
      date: setDate(countryData.updateTime),
      updateTime: countryData.updateTime
    }
  })
write(deathRate2, 'deathRate2.json')

const currentConfirmed = data.map(countryData => {
  return {
    value: countryData.currentConfirmed,
    name: countryData.countryName,
    color: continentColor[countryData.continentName],
    date: setDate(countryData.updateTime),
    updateTime: countryData.updateTime
  }
})
write(currentConfirmed, 'currentConfirmed.json')
