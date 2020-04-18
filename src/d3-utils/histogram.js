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
      title: 'covid-19 data'
    }, options)

    this.histogramWidth = (options.height - options.yStart - options.yEnd) / options.count - options.getter
    this.options = options
    this.data = data
    this.d3Selector = d3.select(selector)
      .append(options.tag)
      .attr('width', options.width)
      .attr('height', options.height)
    this.drawTitle()
    this.drawAxis()
    this.drawRect()
    this.drawText()
  }

  drawTitle () {
    const { options } = this
    this.d3Selector.append('text')
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
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data.map(d => d.x)) * 1.1])
      .range([0, (options.width - options.xStart) * 0.9])
    // 定义y轴的比例尺(序数比例尺)
    const yScale = d3.scaleBand()
      .range([options.yStart, options.height - options.yEnd - options.getter])
      .domain(data.map(d => d.y))

    return {
      xScale,
      yScale
    }
  }

  getAxis () {
    const { xScale, yScale } = this.calScale()
    // 定义x轴和y轴
    const xAxis = d3.axisBottom(xScale).ticks(20)
    const yAxis = d3.axisLeft(yScale)
    return {
      xAxis,
      yAxis
    }
  }

  drawAxis () {
    const { options } = this
    const { xAxis, yAxis } = this.getAxis()
    this.d3Selector.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${options.xStart},${options.height - options.yEnd - options.getter})`)
      .call(xAxis)
    this.d3Selector.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .attr('transform', `translate(${options.xStart - 1},0)`)
  }

  drawRect () {
    const {
      options,
      histogramWidth,
      data
    } = this
    // 定义x轴的比例尺(线性比例尺)
    const { xScale } = this.calScale()
    return this.d3Selector.selectAll('.rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', d => xScale(d.x))
      .attr('height', histogramWidth)
      .attr('x', options.xStart)
      .attr('y', (d, i) => options.yStart + (histogramWidth + options.getter) * i)
      .attr('fill', d => d.color)
  }

  drawText () {
    const {
      options,
      histogramWidth,
      data
    } = this
    // 定义x轴的比例尺(线性比例尺)
    const {
      xScale
    } = this.calScale()
    return this.d3Selector.selectAll('.text')
      .data(data)
      .enter()
      .append('text')
      .text(d => d.x)
      .attr('x', d => xScale(d.x) + options.xStart + options.getter)
      .attr('y', (d, i) => options.yStart + (histogramWidth + options.getter) * (i + 0.5))
      .attr('width', 200)
      .attr('height', histogramWidth)
      .attr('fill', options.textColor)
  }
}
