const fs = require('fs')
const data = require('./data.json')
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

const timelineData = {}

data.forEach(countryData => {
  countryData.timeline.forEach(timeData => {
    if (timelineData[timeData.dateId]) {
      timelineData[timeData.dateId].push({
        data: timeData,
        country: countryData.country,
        countryEn: countryData.countryEn,
        continent: countryData.continent
      })
    } else {
      timelineData[timeData.dateId] = [{
        data: timeData,
        country: countryData.country,
        countryEn: countryData.countryEn,
        continent: countryData.continent
      }]
    }
  })
})
write(timelineData, 'timeline.json')

const top10TimelineTotal = {}
Object.keys(timelineData).forEach(dateId => {
  top10TimelineTotal[dateId] = timelineData[dateId]
    .sort((a, b) => b.data.confirmedCount - a.data.confirmedCount)
    .filter((_, i) => i < 10)
    .map(data => {
      return {
        confirmedCount: data.data.confirmedCount,
        country: data.country,
        countryEn: data.countryEn,
        continent: data.continent
      }
    })
})
write(top10TimelineTotal, 'top10Total.json')
