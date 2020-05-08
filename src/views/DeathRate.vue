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
      valueFormat: t => t.toFixed(2) + '%',
      title: '死亡率1',
      subTitle: 'deathRate = death / (death + recovery) * 100%',
      content: `COVID-19死亡率数据可视化排名\n
      统计数据从2020-02-01开始，数据引用自丁香医生，部分数据可能与实际存在偏差\n
      计算公式：死亡人数/(死亡+治愈)人数 * 100%\n
      部分国家和地区死亡人数和治愈人数存在较大差距，或者统计条件的原因，这公式得出的死亡率较高\n
      只统计死亡+治愈>=1000的数据`
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
