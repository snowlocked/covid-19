<template>
  <div class="histogram" ref="histogram">
  </div>
</template>

<script>
// @ is an alias to /src
import Histogram from '@/d3-utils/histogram.js'
import { continentColor } from '@/const/color.js'
const data = require('$request/top10Total.json')

export default {
  name: 'Home',
  data () {
    return {
      data,
      histogram: null
    }
  },
  mounted () {
    const histogram = this.$refs.histogram
    this.histogram = new Histogram(histogram, data['20200416'].map(d => ({
      x: d.confirmedCount,
      y: d.country,
      color: continentColor[d.continent]
    })), {
      width: histogram.offsetWidth,
      height: 600
    })
  }
}
</script>
<style lang="less">
.histogram{
  .y-axis .tick text{
    font-size: 16px;
  }
}
</style>
