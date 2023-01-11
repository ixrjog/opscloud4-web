<template>
  <d2-container>
    <h1>Leo报表</h1>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px"
                     @click="fetchData" size="mini" plain></el-button>
        </span>
      </el-row>
      <el-row>
        <div id="buildReportChart" style="height:350px; width: 100%"></div>
      </el-row>
      <el-row>
        <div id="deployReportChart" style="height:350px; width: 100%"></div>
      </el-row>
    </el-card>
  </d2-container>
</template>

<script>

import * as echarts from 'echarts'
// API
import { GET_LEO_REPORT } from '@/api/modules/report/report.api'
import InfoCard from '@/components/opscloud/common/InfoCard'

export default {
  data () {
    return {
      title: 'Leo报表',
      report: {}
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
    initBuildChart (buildMonthReport) {
      const myChart = echarts.init(document.getElementById('buildReportChart'))
      const option = {
        title: {
          text: '构建报表（按月）'
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
          data: buildMonthReport.dateCat
        },
        series: [
          {
            name: '构建次数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: buildMonthReport.values
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initDeployChart (deployMonthReport) {
      const myChart = echarts.init(document.getElementById('deployReportChart'))
      const option = {
        title: {
          text: '部署报表（按月）'
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
          data: deployMonthReport.dateCat
        },
        series: [
          {
            name: '部署次数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: deployMonthReport.values
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initData () {
      this.initBuildChart(this.report.buildMonthReport)
      this.initDeployChart(this.report.deployMonthReport)
    },
    fetchData () {
      GET_LEO_REPORT()
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
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}

.el-col {
  border-radius: 4px;
}
</style>
