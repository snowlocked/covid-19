import * as d3 from 'd3'

export default function (element, data, options) {
  let date = []
  data.forEach(element => {
    if (!date.includes(element.date)) {
      date.push(element.date)
    }
  })
  date = date.sort((a, b) => new Date(a) - new Date(b))
  let rate = []
  var time = date.sort((a, b) => a - b)
  var nameList = []
  data
    .sort((a, b) => Number(b.value) - Number(a.value))
    .forEach(e => {
      if (nameList.includes(e.name)) {
        nameList.push(e.name)
      }
    })
  var baseTime = 3000

  // 选择颜色
  function getColor (d) {
    return d.color
  }

  var intervalTime = 1
  var textY = -50
  // 长度小于displayBarInfo的bar将不显示barInfo
  var displayBarInfo = 0
  var leftMargin = 250
  var rightMargin = 150
  var topMargin = 180
  var bottomMargin = 0
  var timeFormat = '%Y-%m-%d'
  var itemX = 250
  var maxNumber = 10
  const labelX = -10

  const margin = {
    left: leftMargin,
    right: rightMargin,
    top: topMargin,
    bottom: bottomMargin
  }

  intervalTime /= 3
  var lastData = []
  var currentDate = time[0]
  var currentData = []
  const width = options.width
  const height = options.height || 800
  const svg = d3.select(element)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom - 32
  const xValue = d => Number(d.value)
  const yValue = d => d.name

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
  const xAxisG = g
    .append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
  const yAxisG = g.append('g')

  xAxisG
    .append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 100)

  var xScale = d3.scaleLinear()
  const yScale = d3
    .scaleBand()
    .paddingInner(0.3)
    .paddingOuter(0)

  const xTicks = 10
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .ticks(xTicks)
    .tickPadding(20)
    .tickSize(-innerHeight)

  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickPadding(5)
    .tickSize(-innerWidth)

  var dateLabelSwitch = 'visible'
  var dateLabelX = innerWidth
  var dateLabelY = innerHeight

  var dateLabel = g
    .insert('text')
    // .data(currentDate)
    .attr('class', 'dateLabel')
    .attr('style:visibility', dateLabelSwitch)
    .attr('x', dateLabelX)
    .attr('y', dateLabelY)
    .attr('text-anchor', 'end')
    .text(currentDate)

  var topLabel = g
    .insert('text')
    .attr('class', 'topLabel')
    .attr('x', itemX)
    .attr('y', textY)

  function dataSort () {
    currentData.sort(function (a, b) {
      if (Number(a.value) === Number(b.value)) {
        var r1 = 0
        var r2 = 0
        for (let index = 0; index < a.name.length; index++) {
          r1 = r1 + a.name.charCodeAt(index)
        }
        for (let index = 0; index < b.name.length; index++) {
          r2 = r2 + b.name.charCodeAt(index)
        }
        return r2 - r1
      } else {
        return Number(b.value) - Number(a.value)
      }
    })
  }

  function getCurrentData (date) {
    rate = []
    currentData = data.filter(item => item.date === date && parseFloat(item.value) !== 0)

    rate.MAX_RATE = 0
    rate.MIN_RATE = 1
    currentData.forEach(e => {
      lastData.forEach(el => {
        if (el.name === e.name) {
          rate[e.name] = Number(Number(e.value) - Number(el.value))
        }
      })
      if (rate[e.name] === undefined) {
        rate[e.name] = rate.MIN_RATE
      }
      if (rate[e.name] > rate.MAX_RATE) {
        rate.MAX_RATE = rate[e.name]
      } else if (rate[e.name] < rate.MIN_RATE) {
        rate.MIN_RATE = rate[e.name]
      }
    })
    currentData = currentData.slice(0, maxNumber)
    dataSort()

    d3.transition('2')
      .each(redraw)
      .each(change)
    lastData = currentData
  }

  var avg = 0

  function redraw () {
    if (currentData.length === 0) return
    xScale
      .domain([0, d3.max(currentData, xValue) + 1])
      .range([0, innerWidth])

    dateLabel
      // .data(currentData)
      .transition()
      .duration(baseTime * intervalTime)
      .ease(d3.easeLinear)
      .tween('text', function (d) {
        var self = this
        var i = d3.interpolateDate(
          new Date(self.textContent),
          new Date(currentDate)
        )
        // var prec = (new Date(d.date) + "").split(".");
        // var round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
        return function (t) {
          var dateformat = d3.timeFormat(timeFormat)
          self.textContent = dateformat(i(t))
        }
      })

    xAxisG
      .transition()
      .duration(baseTime * intervalTime)
      .ease(d3.easeLinear)
      .call(xAxis)
    yAxisG
      .transition()
      .duration(baseTime * intervalTime)
      .ease(d3.easeLinear)
      .call(yAxis)

    yAxisG.selectAll('.tick').remove()
    xAxisG.selectAll('.tick').remove()

    yScale
      .domain(currentData.map(d => d.name).reverse())
      .range([innerHeight, 0])

    var bar = g.selectAll('.bar').data(currentData, function (d) {
      return d.name
    })

    var barEnter = bar
      .enter()
      .insert('g', '.axis')
      .attr('class', 'bar')
      .attr('transform', function (d) {
        return 'translate(0,' + yScale(yValue(d)) + ')'
      })

    barEnter
      .append('rect')
      .attr('width', function (d) {
        return xScale(currentData[currentData.length - 1].value)
      })
      .attr('fill-opacity', 0)
      .attr('height', 26)
      .attr('y', 50)
      .style('fill', d => getColor(d))
      .transition('a')
      .delay(500 * intervalTime)
      .duration(2490 * intervalTime)
      .attr('y', 0)
      .attr('width', d => xScale(xValue(d)))
      .attr('fill-opacity', 1)

    d3.selectAll('rect').attr('rx', 13)

    barEnter
      .append('text')
      .attr('y', 50)
      .attr('fill-opacity', 0)
      .style('fill', d => getColor(d))
      .transition('2')
      .delay(500 * intervalTime)
      .duration(2490 * intervalTime)
      .attr('fill-opacity', 1)
      .attr('y', 0)
      .attr('class', function (d) {
        return 'label '
      })
      .attr('x', labelX)
      .attr('y', 20)
      .attr('text-anchor', 'end')
      .text(function (d) {
        return d.name
      })

    // bar上文字
    let barInfo = barEnter
      .append('text')
      .attr('x', function (d) {
        return xScale(currentData[currentData.length - 1].value)
      })
      .attr('stroke', d => getColor(d))
      .attr('class', 'barInfo')
      .attr('y', 50)
      .attr('stroke-width', '0px')
      .attr('fill-opacity', 0)
      .transition()
      .delay(500 * intervalTime)
      .duration(2490 * intervalTime)
      .text(function (d) {
        return d.name
      })
      .attr('x', d => {
        return xScale(xValue(d)) - 40
      })
      .attr('fill-opacity', function (d) {
        if (xScale(xValue(d)) - 40 < displayBarInfo) {
          return 0
        }
        return 1
      })
      .attr('y', 2)
      .attr('dy', '.5em')
      .attr('text-anchor', 'end')
      .attr('stroke-width', function (d) {
        if (xScale(xValue(d)) - 40 < displayBarInfo) {
          return '0px'
        }
        return '4px'
      })
      .attr('paint-order', 'stroke')

    barEnter
      .append('text')
      .attr('x', function () {
        return xScale(currentData[currentData.length - 1].value)
      })
      .attr('y', 50)
      .attr('fill-opacity', 0)
      .style('fill', d => getColor(d))
      .transition()
      .duration(2990 * intervalTime)
      .tween('text', function (d) {
        var self = this
        // 初始值为d.value的0.9倍
        self.textContent = d.value * 0.9
        var i = d3.interpolate(self.textContent, Number(d.value))
        // d.value = self.textContent
        return function (t) {
          self.textContent = Math.floor(i(t))
          // d.value = self.textContent
        }
      })
      .attr('fill-opacity', 1)
      .attr('y', 0)
      .attr('class', 'value')
      .attr('x', d => {
        return xScale(xValue(d)) + 10
      })
      .attr('y', 22)

    var barUpdate = bar
      .transition('2')
      .duration(2990 * intervalTime)
      .ease(d3.easeLinear)

    barUpdate
      .select('rect')
      .style('fill', d => getColor(d))
      .attr('width', d => xScale(xValue(d)))

    barUpdate
      .select('.label')
      .attr('class', 'label')
      .style('fill', d => getColor(d))
      .attr('width', d => xScale(xValue(d)))

    barUpdate
      .select('.value')
      .attr('class', 'value')
      .style('fill', d => getColor(d))
      .attr('width', d => xScale(xValue(d)))

    barUpdate.select('.barInfo')
      .attr('stroke', function (d) {
        return getColor(d)
      })

    barInfo = barUpdate
      .select('.barInfo')
      .text(function (d) {
        return d.name
      })
      .attr('x', d => {
        return xScale(xValue(d)) - 40
      })
      .attr('fill-opacity', function (d) {
        if (xScale(xValue(d)) - 40 < displayBarInfo) {
          return 0
        }
        return 1
      })
      .attr('stroke-width', function (d) {
        if (xScale(xValue(d)) - 40 < displayBarInfo) {
          return '0px'
        }
        return '4px'
      })
      .attr('paint-order', 'stroke')

    barUpdate
      .select('.value')
      .tween('text', function (d) {
        var self = this
        var i = d3.interpolate(self.textContent, Number(d.value))
        return function (t) {
          self.textContent = Math.round(i(t))
        }
      })
      .duration(2990 * intervalTime)
      .attr('x', d => xScale(xValue(d)) + 10)

    avg =
      (Number(currentData[0].value) +
        Number(currentData[currentData.length - 1].value)) /
      2

    var barExit = bar
      .exit()
      .attr('fill-opacity', 1)
      .transition()
      .duration(2500 * intervalTime)
    barExit
      .attr('transform', 'translate(0, -100)')
      .remove()
      .attr('fill-opacity', 0)
    barExit
      .select('rect')
      .attr('fill-opacity', 0)
      .attr('width', () => {
        return xScale(0)
      })

    barExit
      .select('.value')
      .attr('fill-opacity', 0)
      .attr('x', () => {
        return xScale(0)
      })

    barExit
      .select('.barInfo')
      .attr('fill-opacity', 0)
      .attr('stroke-width', '0px')
      .attr('x', () => {
        return xScale(0)
      })
    barExit.select('.label').attr('fill-opacity', 0)
  }

  function change () {
    yScale
      .domain(currentData.map(d => d.name).reverse())
      .range([innerHeight, 0])

    g.selectAll('.bar')
      .data(currentData, function (d) {
        return d.name
      })
      .transition('1')
      .ease(d3.easeLinear)
      .duration(baseTime * updateRate * intervalTime)
      .attr('transform', function (d) {
        return 'translate(0,' + yScale(yValue(d)) + ')'
      })
  }

  let i = 0
  const updateRate = 1
  const inter = setInterval(function next () {
    currentDate = time[i]
    getCurrentData(time[i])
    i++

    if (i >= time.length) {
      window.clearInterval(inter)
    }
  }, baseTime * intervalTime)
}
