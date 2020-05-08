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
const data = require('$request/deathRate2.json')

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
      max: 20,
      valueFormat: t => t.toFixed(2) + '%',
      title: '死亡率2',
      subTitle: 'deathRate = death / total * 100%,只统计total>=100',
      content: `COVID-19死亡率数据可视化排名\n
      统计数据从2020-02-01开始，数据引用自丁香医生，部分数据可能与实际存在偏差\n
      计算公式：死亡人数/感染人数 * 100%\n
      只统计感染人数>=100的数据`
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
