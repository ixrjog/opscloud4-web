<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover">
      <div id="workEventItemReport" style="width: 100%; height: 400px; margin-top: 20px"/>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { GET_WORK_EVENT_ITEM_REPORT } from '@/api/modules/report/report.api'

export default {
  name: 'WorkEventItemReport',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    initChart (data, color) {
      const myChart = echarts.init(document.getElementById('workEventItemReport'))
      const option = {
        title: {
          text: '工作事件总比例'
        },
        color: color,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          top: '20%',
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '类目',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
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
    fetchData (workRoleId) {
      if (workRoleId !== '') {
        GET_WORK_EVENT_ITEM_REPORT({ workRoleId: workRoleId })
          .then(({ body }) => {
            const data = body.map(e => ({ name: e.cname, value: e.value }))
            const color = body.map(e => (e.color))
            this.initChart(data, color)
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
