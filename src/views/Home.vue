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
    const histogram = this.$refs.histogram
    this.histogram = new Histogram(this.$refs.histogram, data, {
      width: histogram.offsetWidth,
      title: 'covid-19感染人数',
      content: `COVID-19感染人数数据可视化排名\n
      统计数据从2020-02-01开始，数据引用自丁香医生，部分数据可能与实际存在偏差`
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
