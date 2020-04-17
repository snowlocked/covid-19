const fs = require('fs')
const data = require('../data/json/DXYArea-TimeSeries.json')
const keysData = {}

const resolvePath = (file) => `${__dirname}/${file}`
const getNumbers = str => {
  let nums = str.split('/').slice(3)
  const last = nums.pop().split('-')
  last[1] = last[1].split('.')[0]
  nums = nums.concat(last).map(n => +n)
  return nums
}

const s1IsLargeThanS2 = (s1, s2) => {
  const arr1 = getNumbers(s1)
  const arr2 = getNumbers(s2)
  const len = arr1.length
  for (let i = 0; i < len; i++) {
    if (arr1[i] > arr2[i]) {
      return true
    } else if (arr1[i] < arr2[i]) {
      return false
    }
  }
  return false
}

data.forEach(item => {
  if (!keysData[item.provinceName] && item.provinceName === item.countryName) {
    keysData[item.provinceName] = {
      countryEnglishName: item.countryEnglishName || item.countryFullName,
      statisticsData: item.statisticsData
    }
  } else if (item.statisticsData && keysData[item.provinceName] && (keysData[item.provinceName].statisticsData !== item.statisticsData)) {
    if (s1IsLargeThanS2(item.statisticsData, keysData[item.provinceName].statisticsData)) {
      console.log(item.provinceName, item.statisticsData, keysData[item.provinceName].statisticsData)
      keysData[item.provinceName] = {
        countryEnglishName: item.countryEnglishName || item.countryFullName,
        statisticsData: item.statisticsData
      }
    }
  }
})

fs.writeFile(resolvePath('keysDataUrl.json'), JSON.stringify(keysData), 'utf8', function (error) {
  if (error) {
    console.log(error)
    return false
  }
  console.log('写入keysDataUrl.json成功')
})
