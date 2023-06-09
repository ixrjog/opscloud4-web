<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px" @click="fetchData" size="mini" plain/>
        </span>
      </el-row>
      <el-row>
        <div id="prodDeployChart" style="height:250px; width: 100%"/>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import * as echarts from 'echarts'

// API
import { GET_LEO_PROD_REPORT } from '@/api/modules/report/report.api'

export default {
  name: 'ContinuousDeliveryProdReport',
  data () {
    return {
      title: '持续交付2.0-报表',
      report: {}
    }
  },
  components: {},
  computed: {},
  mounted () {
  },
  methods: {
    initDeployChart (continuousDeliveryReport) {
      const myChart = echarts.init(document.getElementById('prodDeployChart'))
      const option = {
        color: ['#36c6ae'],
        title: {
          text: '最近30天生产环境部署报表'
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
          data: continuousDeliveryReport.dateCat
        },
        series: [
          {
            name: '部署次数',
            type: 'bar',
            stack: 'deploy',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            },
            emphasis: {
              focus: 'series'
            },
            data: continuousDeliveryReport.valueMap.DEPLOY
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initData () {
      this.initDeployChart(this.report.continuousDeliveryReport)
    },
    fetchData () {
      GET_LEO_PROD_REPORT()
        .then(res => {
          this.report = res.body
          this.initData()
        })
    }
  }
}
</script>

<style lang="less" scoped>

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

  & :last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.chart {
  height: 100vh;
}

.title {
  color: #9d9fa3;
}

.label {
  font-size: 10px;
  color: #B7B6B6;
}

.value {
  font-size: 45px;
  color: #20A9D9;
  font-weight: 300;
  margin-left: 2px;
}

</style>
