const d3 = require('d3')

export default class {
  constructor (selector, data, options = {}) {
    options = Object.assign({
      tag: 'svg'
    }, options)
    this.options = options
    this.data = data
    this.d3Selector = d3.select(selector)
      .append(options.tag)
      .attr('width', options.width)
      .attr('height', options.height)
  }
}
