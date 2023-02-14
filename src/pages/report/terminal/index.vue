<template>
  <d2-container>
    <h1>堡垒机终端审计报表</h1>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px"
                     @click="fetchData" size="mini" plain></el-button>
        </span>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row :gutter="24">
            <el-col :span="12">
              <info-card title="审计用户总数" tag="Users" :content="report.userTotal" footer="All user"></info-card>
            </el-col>
            <el-col :span="12">
              <info-card title="审计会话总数" tag="Sessions" :content="report.sessionTotal" footer="All session"></info-card>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <info-card title="审计实例总数" tag="Instances" :content="report.instanceTotal" footer="All instance"></info-card>
            </el-col>
            <el-col :span="12">
              <info-card title="审计命令总数" tag="Commands" :content="report.commandTotal" footer="All command"></info-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <div id="sessionReportChart" style="height:350px; width: 100%"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div id="instanceReportChart" style="height:350px; width: 100%"></div>
        </el-col>
        <el-col :span="12">
          <div id="commandReportChart" style="height:350px; width: 100%"></div>
        </el-col>
      </el-row>
    </el-card>
  </d2-container>
</template>

<script>

import * as echarts from 'echarts'
// API
import { GET_TERMINAL_REPORT } from '@/api/modules/report/report.api'
import InfoCard from '@/components/opscloud/common/InfoCard'

export default {
  data () {
    return {
      title: '终端报表',
      report: ''
    }
  },
  components: {
    InfoCard
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  methods: {
    initSessionChart (sessionReport) {
      const myChart = echarts.init(document.getElementById('sessionReportChart'))
      const option = {
        color: [ '#bd5a39','#c9171f','#eaa235'],
        title: {
          text: '会话审计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: sessionReport.dateCat
        },
        series: [
          {
            name: '服务器终端',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: sessionReport.valueMap.WEB_TERMINAL
          },
          {
            name: '容器终端',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: sessionReport.valueMap.KUBERNETES_TERMINAL
          },
          {
            name: 'SSH-Server',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: sessionReport.valueMap.SSH_SERVER
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initInstanceChart (instanceReport) {
      const myChart = echarts.init(document.getElementById('instanceReportChart'))
      const option = {
        color: [ '#bd5a39','#c9171f','#eaa235'],
        title: {
          text: '实例审计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: instanceReport.dateCat
        },
        series: [
          {
            name: '服务器',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: instanceReport.valueMap.SERVER
          },
          {
            name: '容器',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: instanceReport.valueMap.CONTAINER_TERMINAL
          },
          {
            name: '容器日志',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: instanceReport.valueMap.CONTAINER_LOG
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initCommandChart (commandMonthReport) {
      const myChart = echarts.init(document.getElementById('commandReportChart'))
      const option = {
        color: [ '#12c0ea'],
        title: {
          text: '命令审计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: commandMonthReport.dateCat
        },
        series: [
          {
            name: '命令',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: commandMonthReport.values
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initData () {
      this.initSessionChart(this.report.sessionReport)
      this.initInstanceChart(this.report.instanceReport)
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

.el-row {
  margin-bottom: 20px; &:last-child {
   margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}
</style>
