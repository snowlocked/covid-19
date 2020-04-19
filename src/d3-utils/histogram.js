const d3 = require('d3')

export default class {
  constructor (selector, data, options = {}) {
    options = Object.assign({
      tag: 'svg',
      count: 10,
      xStart: 120,
      yStart: 60,
      yEnd: 16,
      getter: 8,
      textColor: '#000',
      title: 'covid-19 data',
      duration: 1.5e3,
      delay: 50
    }, options)

    this.histogramWidth = (options.height - options.yStart - options.yEnd) / options.count - options.getter
    this.options = options
    this.data = data
    this.svg = d3.select(selector)
      .append(options.tag)
      .attr('width', options.width)
      .attr('height', options.height)
    this.g = this.svg.append('g')
    this.drawTitle()
    this.calScale()
    this.getAxis()
    this.drawAxis()
    this.drawRect()
    this.drawText()
  }

  drawTitle () {
    const { options } = this
    return this.svg.append('text')
      .text(options.title)
      .attr('class', 'title')
      .attr('x', options.width / 2)
      .attr('y', options.yEnd)
      .attr('text-anchor', 'middle')
      .attr('style', 'font-size:18px;font-weight:bold;')
  }

  calScale () {
    const {
      options,
      data
    } = this
    // 定义x轴的比例尺(线性比例尺)
    this.xScale = d3.scaleLinear()
      .domain([0, d3.max(data.map(d => d.x)) * 1.1])
      .range([0, (options.width - options.xStart) * 0.9])
    // 定义y轴的比例尺(序数比例尺)
    const copyData = [...data]
    while (copyData.length < 10) {
      copyData.push({
        y: `$${Math.random()}`
      })
    }
    this.yScale = d3.scaleBand()
      .range([options.yStart, options.height - options.yEnd - options.getter])
      .domain(copyData.map(d => d.y))
  }

  getAxis () {
    const { xScale, yScale } = this
    // 定义x轴和y轴
    this.xAxis = d3.axisBottom(xScale).ticks(20)
    this.yAxis = d3.axisLeft(yScale).tickFormat(v => v.indexOf('$') > -1 ? '' : v)
  }

  drawAxis () {
    const {
      options,
      xAxis,
      yAxis
    } = this
    this.xAxisG = this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${options.xStart},${options.height - options.yEnd - options.getter})`)
      .call(xAxis)
    this.yAxisG = this.svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .attr('transform', `translate(${options.xStart - 1},0)`)
  }

  yPosition (i) {
    const {
      options: {
        getter,
        yStart
      },
      histogramWidth
    } = this
    return yStart + (histogramWidth + getter) * i
  }

  drawRect () {
    const {
      options,
      histogramWidth,
      data,
      xScale,
      yScale
    } = this
    // 定义x轴的比例尺(线性比例尺)
    const rect = this.g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('fill', d => d.color)
      .attr('height', histogramWidth)
      .attr('x', options.xStart)
      .attr('y', options.height)
      .transition()
      .attr('y', (d, i) => this.yPosition(i))
      .duration(options.duration)
      .attr('width', d => xScale(d.x))
  }

  drawText () {
    const {
      options,
      histogramWidth,
      data,
      xScale
    } = this
    // 定义x轴的比例尺(线性比例尺)
    const text = this.g.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(d => d.x)
      .attr('x', options.xStart + options.getter)
      .attr('y', options.height)
      .attr('fill', options.textColor)
      .attr('class', 'text')
      .transition()
      .duration(options.duration)
      .attr('y', (d, i) => options.yStart + (histogramWidth + options.getter) * (i + 0.5))
      .attr('x', d => xScale(d.x) + options.xStart + options.getter)
  }

  update (data) {
    this.oldData = this.data
    this.data = data
    this.calScale()
    this.getAxis()
    const {
      options,
      xAxis,
      yAxis
    } = this

    this.xAxisG
      .transition()
      .duration(options.duration)
      .ease(d3.easeLinear)
      .call(xAxis)
    this.yAxisG
      .transition()
      .duration(options.duration)
      .ease(d3.easeLinear)
      .call(yAxis)
    this.updateRect()
    this.updateText()
  }

  updateRect () {
    const {
      options,
      histogramWidth,
      xScale,
      data
    } = this
    const rect = this.g.selectAll('rect').data(data)
    // const rectEnter = rect.enter()
    rect
      .attr('fill-opacity', 0)
      .attr('fill', d => d.color)
      .attr('height', histogramWidth)
      .attr('x', options.xStart)
      .transition()
      .delay(options.delay)
      .duration(options.duration)
      .ease(d3.easeLinear)
      .attr('y', (d, i) => this.yPosition(i))
      .attr('fill-opacity', 1)
      .attr('width', d => xScale(d.x))

    rect.enter()
      .append('rect')
      .attr('fill', d => d.color)
      .attr('height', histogramWidth)
      .attr('x', options.xStart)
      .attr('y', options.height)
      .transition()
      .delay(options.delay)
      .duration(options.duration)
      .ease(d3.easeLinear)
      .attr('fill-opacity', 1)
      .attr('y', (d, i) => this.yPosition(i))
      .attr('width', d => xScale(d.x))

    rect
      .exit()
      .attr('fill-opacity', 1)
      .transition()
      .duration(options.duration)
      .attr('width', 0)
      .attr('y', options.height)
      .attr('fill-opacity', 0)
      .remove()
  }

  updateText () {
    const {
      options,
      histogramWidth,
      xScale,
      data
    } = this
    const text = this.g.selectAll('text').data(data)
    text
      .attr('fill', options.textColor)
      .attr('fill-opacity', 0)
      .transition()
      .delay(options.delay)
      .duration(options.duration)
      .attr('y', (d, i) => options.yStart + (histogramWidth + options.getter) * (i + 0.5))
      .tween('text', function (d) {
        // 初始值为d.value的0.9倍
        this.textContent = d.x * 0.9
        const i = d3.interpolate(this.textContent, d.x)
        return t => {
          this.textContent = Math.floor(i(t))
        }
      })
      .attr('x', d => xScale(d.x) + options.xStart + options.getter)
      .attr('fill-opacity', 1)
    text
      .enter()
      .append('text')
      .attr('x', options.xStart)
      .attr('fill', options.textColor)
      .attr('fill-opacity', 0)
      .attr('y', options.height)
      .transition()
      .delay(options.delay)
      .duration(options.duration)
      .attr('y', (d, i) => options.yStart + (histogramWidth + options.getter) * (i + 0.5))
      .tween('text', function (d) {
        // 初始值为d.value的0.9倍
        this.textContent = d.x * 0.9
        const i = d3.interpolate(this.textContent, d.x)
        return t => {
          this.textContent = Math.floor(i(t))
        }
      })
      .attr('x', d => xScale(d.x) + options.xStart + options.getter)
      .attr('fill-opacity', 1)
    text
      .exit()
      .attr('fill-opacity', 1)
      .transition()
      .duration(options.duration)
      .attr('x', options.xStart)
      .attr('y', options.height)
      .attr('fill-opacity', 0)
      .remove()
  }
}
