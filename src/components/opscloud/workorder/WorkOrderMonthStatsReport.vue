<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px"
                     @click="fetchData" size="mini" plain/>
        </span>
      </el-row>
      <div id="workOrderMonthStatsReport" style="height:450px;width: 100%"/>
    </el-card>
  </div>
</template>

<script>

import * as echarts from 'echarts'
import { QUERY_WORK_ORDER_REPORT_BY_MONTH } from '@/api/modules/workorder/workorder.report.api'

export default {
  name: 'WorkorderMonthStatsReport',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    initChart (chartData) {
      const myChart = echarts.init(document.getElementById('workOrderMonthStatsReport'))
      const option = {
        color: chartData.color,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: chartData.legendDate
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
            data: chartData.xData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: chartData.yData
      }
      myChart.setOption(option, true)
    },
    fetchData () {
      QUERY_WORK_ORDER_REPORT_BY_MONTH()
        .then(res => {
          this.initData(res.body)
        })
    },
    initData (body) {
      const chartData = {
        xData: [],
        yData: [],
        legendData: [],
        color: []
      }
      // 日期类目
      chartData.xData = body.dateCat
      for (const name in body.nameCat) {
        const item = body.nameCat[name]
        chartData.color.push(item.color)
        chartData.legendData.push(name)
        const type = {
          name: name,
          type: 'bar',
          stack: 'type',
          emphasis: {
            focus: 'series'
          },
          data: item.values
        }
        chartData.yData.push(type)
      }
      this.initChart(chartData)
    }
  }
}
</script>

<style scoped>

</style>
