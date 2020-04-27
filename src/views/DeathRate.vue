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
const data = require('$request/deathRate.json')

export default {
  name: 'Home',
  data () {
    return {
      histogram: null
    }
  },
  mounted () {
    const histogram = this.$refs.histogram
    this.histogram = new Histogram(this.$refs.histogram, data, {
      width: histogram.offsetWidth,
      max: 100,
      fixed: 2
    })
  },
  methods: {
    run () {
      this.histogram.animate()
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
