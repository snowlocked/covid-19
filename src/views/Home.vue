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
import draw from '@/d3-utils/draw.js'
const data = require('$request/totalConfirmData.json')

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
  },
  methods: {
    run () {
      const histogram = this.$refs.histogram
      draw(this.$refs.histogram, data, {
        width: histogram.offsetWidth
      })
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
