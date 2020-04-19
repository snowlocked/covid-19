<template>
  <div class="about" ref="about">
  </div>
</template>
<script>
const d3 = require('d3')
export default {
  mounted () {
    var h = 500
    var w = 500

    var data = [
      10,
      15,
      12,
      9,
      3
    ]

    var vis = d3.select(this.$refs.about)
      .append('svg')
      .attr('height', 500)
      .attr('width', 500)
      .append('g')

    vis.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function (d, i) { return 0 })
      .attr('y', function (d, i) { return i * 15 })
      .attr('height', function (d) { return 10 })
      .attr('width', function (d) { return d * 5 })
      .attr('fill', function (d, i) { return ['red', 'green'][i % 2] })

    var dataTwo = [
      6,
      15,
      20,
      19
    ]

    var update = vis.selectAll('rect')
      .data(dataTwo)
    update.transition()
      .duration(1000)
      .delay(1000)
      .attr('x', function (d, i) { return 0 })
      .attr('y', function (d, i) { return i * 15 })
      .attr('height', function (d) { return 10 })
      .attr('width', function (d) { return d * 5 })
      .attr('fill', function (d, i) { return ['blue', 'black'][i % 2] })

    // update.exit().transition()
    //   .duration(1000).remove()
  }
}
</script>
