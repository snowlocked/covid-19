import * as d3 from 'd3'
export default class {
  constructor (selector, data, options) {
    this.selector = selector
    this.data = data
    this.options = Object.assign({}, options, {
      height: 600,
      baseTime: 3e3,
      intervalTime: 1,
      textY: 150,
      leftMargin: 130,
      rightMargin: 100,
      topMargin: 60,
      bottomMargin: 0,
      timeFormat: '%Y-%m-%d',
      itemX: 250,
      maxNumber: 10,
      labelX: -10,
      xTicks: 10,
      dateLabelSwitch: 'visible',
      dateLabelY: -10,
      updateRate: 1
    })

    this.margin = {
      left: this.options.leftMargin,
      right: this.options.rightMargin,
      top: this.options.topMargin,
      bottom: this.options.bottomMargin
    }
    const { margin, options: { width, height } } = this
    this.options.innerWidth = width - margin.left - margin.right
    this.options.innerHeight = height - margin.top - margin.bottom - 32
    this.options.intervalTime /= 3
    this.options.dateLabelX = this.options.innerWidth
    this.setDates()
    this.initSvg()
  }

  setDates () {
    const { data } = this
    const date = []
    data.forEach(item => {
      if (!date.includes(item.date)) {
        date.push(item.date)
      }
    })
    this.date = date.sort((a, b) => new Date(a) - new Date(b))
    this.time = date.sort((a, b) => a - b)
    this.currentDate = this.time[0]
    this.currentData = []
    this.lastData = []
    this.avg = 0
  }

  initSvg () {
    const {
      selector,
      options: {
        width,
        height,
        innerHeight,
        innerWidth,
        xTicks,
        dateLabelSwitch,
        dateLabelX,
        dateLabelY,
        itemX,
        textY
      },
      margin,
      currentDate
    } = this
    this.svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    this.g = this.svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
    this.xAxisG = this.g
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
    this.yAxisG = this.g.append('g')
    this.xAxisG
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', 100)
    this.xScale = d3.scaleLinear()
    this.yScale = d3
      .scaleBand()
      .paddingInner(0.3)
      .paddingOuter(0)

    this.xAxis = d3
      .axisBottom()
      .scale(this.xScale)

    this.yAxis = d3
      .axisLeft()
      .scale(this.yScale)
    this.dateLabel = this.g
      .insert('text')
      .attr('class', 'dateLabel')
      .attr('style:visibility', dateLabelSwitch)
      .attr('x', dateLabelX)
      .attr('y', dateLabelY)
      .attr('text-anchor', 'end')
      .text(currentDate)

    this.topLabel = this.g
      .insert('text')
      .attr('class', 'topLabel')
      .attr('x', itemX)
      .attr('y', textY)
    this.i = 0
    this.next()
  }

  getColor (d) {
    return d.color
  }

  xValue (d) {
    return Number(d.value)
  }

  yValue (d) {
    return d.name
  }

  dataSort () {
    const { currentData } = this
    currentData.sort(function (a, b) {
      if (Number(a.value) === Number(b.value)) {
        let r1 = 0
        let r2 = 0
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

  getCurrentData () {
    const { options: { maxNumber }, currentDate } = this
    const rate = []
    this.currentData = this.data.filter(item => item.date === currentDate && parseFloat(item.value) !== 0)

    rate.MAX_RATE = 0
    rate.MIN_RATE = 1
    this.currentData.forEach(e => {
      this.lastData.forEach(el => {
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
    this.dataSort()
    this.currentData = this.currentData.slice(0, maxNumber)

    d3.transition('2')
      .each(this.redraw.bind(this))
      .each(this.change.bind(this))
    this.lastData = this.currentData
  }

  redraw () {
    const {
      currentDate,
      currentData,
      g,
      getColor,
      xValue,
      xScale,
      xAxis,
      xAxisG,
      yValue,
      yScale,
      yAxis,
      yAxisG,
      dateLabel,
      options: {
        innerWidth,
        baseTime,
        intervalTime,
        timeFormat,
        labelX,
        height,
        max,
        fixed
      }
    } = this
    if (currentData.length === 0) return
    xScale
      .domain([0, max || d3.max(currentData.map(data => data.value)) * 1.1])
      .range([0, innerWidth])

    dateLabel
      .transition()
      .duration(baseTime * intervalTime)
      .ease(d3.easeLinear)
      .tween('text', function () {
        var i = d3.interpolateDate(
          new Date(this.textContent),
          new Date(currentDate)
        )
        return t => {
          var dateformat = d3.timeFormat(timeFormat)
          this.textContent = dateformat(i(t))
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

    yScale
      .domain(currentData.map(d => d.name).reverse())
      .range([innerHeight, 0])

    this.bar = g.selectAll('.bar').data(currentData, function (d) {
      return d.name
    })

    this.barEnter = this.bar
      .enter()
      .insert('g', '.axis')
      .attr('class', 'bar')
      .attr('transform', function (d) {
        return `translate(0, ${yScale(yValue(d))})`
      })

    this.barEnter
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

    // d3.selectAll('rect').attr('rx', 13)

    this.barEnter
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

    this.barEnter
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
        // 初始值为d.value的0.9倍
        this.textContent = d.value * 0.9
        var i = d3.interpolate(this.textContent, Number(d.value))
        return t => {
          this.textContent = fixed ? i(t).toFixed(fixed) : Math.floor(i(t))
        }
      })
      .attr('fill-opacity', 1)
      .attr('y', 0)
      .attr('class', 'value')
      .attr('x', d => {
        return xScale(xValue(d)) + 10
      })
      .attr('y', 22)

    this.barUpdate = this.bar
      .transition('2')
      .duration(2990 * intervalTime)
      .ease(d3.easeLinear)

    this.barUpdate
      .select('rect')
      .style('fill', d => getColor(d))
      .attr('width', d => xScale(xValue(d)))

    this.barUpdate
      .select('.label')
      .attr('class', 'label')
      .style('fill', d => getColor(d))
      .attr('width', d => xScale(xValue(d)))

    this.barUpdate
      .select('.value')
      .attr('class', 'value')
      .style('fill', d => getColor(d))
      .attr('width', d => xScale(xValue(d)))

    this.barUpdate
      .select('.value')
      .tween('text', function (d) {
        var i = d3.interpolate(this.textContent, Number(d.value))
        return t => {
          this.textContent = fixed ? i(t).toFixed(fixed) : Math.floor(i(t))
        }
      })
      .duration(2990 * intervalTime)
      .attr('x', d => xScale(xValue(d)) + 10)

    this.avg =
      (Number(currentData[0].value) +
        Number(currentData[currentData.length - 1].value)) /
      2

    this.barExit = this.bar
      .exit()
      .attr('fill-opacity', 1)
      .transition()
      .duration(2500 * intervalTime)
    this.barExit
      .attr('transform', `translate(0, ${height})`)
      .remove()
      .attr('fill-opacity', 0)
    this.barExit
      .select('rect')
      .attr('fill-opacity', 0)
      .attr('width', () => {
        return xScale(0)
      })

    this.barExit
      .select('.value')
      .attr('fill-opacity', 0)
      .attr('x', () => {
        return xScale(0)
      })

    this.barExit
      .select('.barInfo')
      .attr('fill-opacity', 0)
      .attr('stroke-width', '0px')
      .attr('x', () => {
        return xScale(0)
      })
    this.barExit.select('.label').attr('fill-opacity', 0)
  }

  change () {
    const {
      currentData,
      yValue,
      yScale,
      options: {
        innerHeight,
        baseTime,
        intervalTime,
        updateRate
      }
    } = this
    this.yScale
      .domain(currentData.map(d => d.name).reverse())
      .range([innerHeight, 0])

    this.g.selectAll('.bar')
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

  next () {
    const { time } = this
    this.currentDate = time[this.i]
    this.getCurrentData()
    this.i++
  }

  animate () {
    const {
      i,
      time,
      options: {
        baseTime,
        intervalTime
      }
    } = this
    this.next()
    if (i < time.length) {
      this.timeout = setTimeout(this.animate.bind(this), baseTime * intervalTime)
    }
  }
}
