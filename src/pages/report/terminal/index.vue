<template>
  <d2-container>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px"
                     @click="fetchData" size="mini" plain></el-button>
        </span>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div id="sessionMonthReport" style="height:350px; width: 100%"></div>
        </el-col>
        <el-col :span="12">
          <div id="instanceMonthReport" style="height:350px; width: 100%"></div>
        </el-col>
      </el-row>
      <el-row>
        <div id="commandMonthReport" style="height:350px; width: 100%"></div>
      </el-row>
    </el-card>
  </d2-container>
</template>

<script>

import * as echarts from 'echarts'
// API
import { GET_TERMINAL_REPORT } from '@/api/modules/report/report.api'

export default {
  data () {
    return {
      title: '终端报表',
      report: ''
    }
  },
  components: {},
  computed: {},
  mounted () {
    this.fetchData()
  },
  methods: {
    initSessionChart (sessionMonthReport) {
      const myChart = echarts.init(document.getElementById('sessionMonthReport'))
      const option = {
        title: {
          text: '会话审计'
        },
        xAxis: {
          type: 'category',
          data: sessionMonthReport.dateCat
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: sessionMonthReport.values,
            type: 'bar',
            itemStyle: {
              color: '#609F5C'
            }
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initInstanceChart (instanceMonthReport) {
      const myChart = echarts.init(document.getElementById('instanceMonthReport'))
      const option = {
        title: {
          text: '实例审计'
        },
        xAxis: {
          type: 'category',
          data: instanceMonthReport.dateCat
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: instanceMonthReport.values,
            type: 'bar',
            itemStyle: {
              color: '#E3C454'
            }
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initCommandChart (commandMonthReport) {
      const myChart = echarts.init(document.getElementById('commandMonthReport'))
      const option = {
        title: {
          text: '命令审计'
        },
        xAxis: {
          type: 'category',
          data: commandMonthReport.dateCat
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: commandMonthReport.values,
            type: 'bar',
            itemStyle: {
              color: '#4A5FAB'
            }
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initData () {
      this.initSessionChart(this.report.sessionMonthReport)
      this.initInstanceChart(this.report.instanceMonthReport)
      this.initCommandChart(this.report.commandMonthReport)
    },
    fetchData () {
      GET_TERMINAL_REPORT()
        .then(res => {
          this.report = res.body
          this.initData()
        })
    }
  }
}
</script>

<style scoped>
.input-bar {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px;
}

.button {
  margin-left: 5px;
}
</style>
