<template>
  <div class="histogram" ref="histogram"></div>
</template>

<script>
// @ is an alias to /src
import Histogram from '@/d3-utils/histogram.js'
const data = require('$request/data.json')

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
    this.histogram = new Histogram(histogram, this.data, {
      width: histogram.offsetWidth,
      height: 600
    })
  }
}
</script>
