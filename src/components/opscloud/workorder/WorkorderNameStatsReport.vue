<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px"
                     @click="fetchData" size="mini" plain></el-button>
        </span>
      </el-row>
      <div id="workorderNameStatsReport" style="height:500px;width: 100%"></div>
    </el-card>
  </div>
</template>

<script>

import * as echarts from 'echarts'
import { QUERY_WORK_ORDER_REPORT_BY_NAME } from '@/api/modules/workorder/workorder.report.api'

export default {
  name: 'WorkorderNameStatsReport',
  data () {
    return {
      option: Option
    }
  },
  mounted () {
  },
  methods: {
    initChart (data) {
      const myChart = echarts.init(document.getElementById('workorderNameStatsReport'))
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '工单名称',
            type: 'pie',
            radius: ['70%', '80%'],
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
        .then(({ body }) => {
          const data = []
          for (const i of body) {
            data.push({
              name: i.cname,
              value: i.value
            })
          }
          this.initChart(data)
        })
    }
  }
}
</script>

<style scoped>

</style>
