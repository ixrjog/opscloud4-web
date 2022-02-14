<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-col>
    <el-col :span="16">22222</el-col>
  </el-row>
</template>

<script>

import * as echarts from 'echarts'
import { QUERY_WORK_ORDER_REPORT_BY_NAME } from '@/api/modules/workorder/workorder.report.api'

export default {
  name: 'WorkOrderReport',
  data () {
    return {
      option: Option
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    initChart (data) {
      let myChart = echarts.init(document.getElementById('main'))
      let option  = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '工单名称',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      }
      myChart.setOption(option, true)
    },
    fetchData () {
      QUERY_WORK_ORDER_REPORT_BY_NAME()
        .then(res => {
          this.initChart(res.body)
        })
    }
  }
}
</script>

<style scoped>

</style>
