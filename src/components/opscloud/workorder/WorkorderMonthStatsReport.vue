<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px"
                     @click="fetchData" size="mini" plain></el-button>
        </span>
      </el-row>
      <div id="workorderMonthStatsReport" style="height:500px;width: 100%"></div>
    </el-card>
  </div>
</template>

<script>

import * as echarts from 'echarts'
import { QUERY_WORK_ORDER_REPORT_BY_MONTH } from '@/api/modules/workorder/workorder.report.api'

const data = {
  name: '',
  type: 'bar',
  stack: '',
  emphasis: {
    focus: 'series'
  },
  data: []
}

export default {
  name: 'WorkorderMonthStatsReport',
  data () {
    return {
      monthStatistics: {},
      legendData: [],
      xData: [],
      yData: []
    }
  },
  mounted () {
  },
  methods: {
    initChart () {
      const myChart = echarts.init(document.getElementById('workorderMonthStatsReport'))
      const xData = this.xData
      const yData = this.yData
      const legendDate = this.legendDate
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: legendDate
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: yData
      }
      myChart.setOption(option, true)
    },
    fetchData () {
      QUERY_WORK_ORDER_REPORT_BY_MONTH()
        .then(res => {
          this.monthStatistics = res.body
          this.initData()
          this.initChart()
        })
    },
    initData () {
      this.xData = []
      this.yData = []
      this.legendData = []
      this.xData = this.monthStatistics.dateCatList
      const nameMap = this.objToMap(this.monthStatistics.nameStatistics)
      nameMap.forEach((value, key) => {
        this.legendData.push(key)
        const type = Object.assign({}, data)
        type.name = key
        type.stack = 'type'
        type.data = value
        this.yData.push(type)
      })
    },
    objToMap (obj) {
      const map = new Map()
      for (const k in obj) {
        map.set(k, obj[k])
      }
      return map
    }
  }
}
</script>

<style scoped>

</style>
