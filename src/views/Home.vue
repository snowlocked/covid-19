<template>
  <div class="histogram">
    <div>
      <el-button @click="run" size="small" type="success">运行</el-button>
    </div>
    <div ref="histogram"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import Histogram from '@/d3-utils/histogram.js'
import { continentColor } from '@/const/color.js'
const data = require('$request/top10Total.json')

const createHistogramData = data => data.map(d => ({
  x: d.confirmedCount,
  y: d.country,
  color: continentColor[d.continent]
}))

export default {
  name: 'Home',
  data () {
    return {
      index: 0,
      histogram: null,
      dateIds: Object.keys(data).map(key => key),
      timeout: null
    }
  },
  mounted () {
    const histogram = this.$refs.histogram
    this.histogram = new Histogram(histogram, createHistogramData(data[this.dateIds[this.index]]), {
      width: histogram.offsetWidth,
      height: 600
    })
  },
  methods: {
    run () {
      if (this.index >= this.dateIds.length - 1) {
        clearTimeout(this.timeout)
        this.index = 0
      } else {
        this.animate()
        this.timeout = setTimeout(this.run, 1e3 / 1)
      }
      // this.animate()
    },
    animate () {
      this.index++
      this.histogram.update(createHistogramData(data[this.dateIds[this.index]]))
    }
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
