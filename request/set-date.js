const dayjs = require('dayjs')
module.exports = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}
