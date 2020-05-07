const _ = require('lodash')
const setDate = require('./set-date.js')
const data = require('../data/json/DXYArea-TimeSeries.json')
  .filter(item => item.updateTime > new Date(2020, 1, 1).getTime())
const foreignData = data.filter(item => item.countryName !== '中国')
const chinaProvinceData = data
  .filter(countryData => countryData.countryName === '中国')
  .map(item => {
    delete item.cities
    return item
  })
let chinaData = []
const chinaObjectDate = {}
chinaProvinceData.forEach(item => {
  const date = setDate(item.updateTime)
  const key = `${item.provinceName}:${date}`
  item.date = date
  if (!chinaObjectDate[key] || (chinaObjectDate[key] && item.updateTime > chinaObjectDate[key])) {
    chinaObjectDate[key] = item.updateTime
    chinaData.push(item)
  }
})
chinaData = _.groupBy(chinaData, 'date')
chinaData = Object.keys(chinaData).map(date => {
  const chinaDate = chinaData[date]
  let chinaDayData = chinaDate.find(item => item.provinceName === '中国')
  if (chinaDayData) {
    return chinaDayData
  }
  chinaDayData = chinaDate.reduce(
    (pre, item) => {
      pre.confirmedCount += item.confirmedCount
      pre.suspectedCount += item.suspectedCount
      pre.curedCount += item.curedCount
      pre.deadCount += item.deadCount
      pre.deadRate = (pre.deadCount / pre.confirmedCount * 100).toFixed(2)
      if (item.incrVo) {
        pre.incrVo = {
          currentConfirmedIncr: pre.incrVo.currentConfirmedIncr + item.incrVo.currentConfirmedIncr || 0,
          confirmedIncr: pre.incrVo.confirmedIncr + item.incrVo.confirmedIncr || 0,
          curedIncr: pre.incrVo.curedIncr + item.incrVo.curedIncr || 0,
          deadIncr: pre.incrVo.deadIncr + item.incrVo.deadIncr || 0
        }
      }

      if (item.updateTime > pre.updateTime) {
        pre.updateTime = item.updateTime
        pre.date = item.date
      }
      return pre
    },
    {
      provinceName: '中国',
      confirmedCount: 0,
      suspectedCount: 0,
      curedCount: 0,
      deadCount: 0,
      deadRate: 0,
      locationId: 951001,
      countryShortCode: 'CHN',
      countryFullName: 'China',
      continentName: '亚洲',
      countryName: '中国',
      provinceShortName: '中国',
      continentEnglishName: 'Asia',
      countryEnglishName: 'China',
      provinceEnglishName: 'China',
      updateTime: 0
    }
  )
  return chinaDayData
})

module.exports = foreignData.concat(chinaData)
