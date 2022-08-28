<template>
  <div>
    <el-card shadow="hover">
      <div id="workEventFaultReport" style="width: 100%; height: 400px; margin-top: 20px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { GET_WORK_EVENT_FAULT_REPORT } from '@/api/modules/report/report.api'

export default {
  name: 'WorkEventFaultReport',
  mounted () {
    this.fetchData()
  },
  methods: {
    initChart (source, time) {
      const myChart = echarts.init(document.getElementById('workEventFaultReport'))
      const option = {
        color: ['#67C23A', '#F56C6C'],
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: source
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'pie',
            id: 'pie',
            radius: ['30%', '40%'],
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@time} ({d}%)'
            },
            encode: {
              itemName: '周',
              value: time,
              tooltip: time
            }
          }
        ]
      }
      myChart.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      })
      myChart.setOption(option, true)
    },
    fetchData () {
      GET_WORK_EVENT_FAULT_REPORT()
        .then(({ body }) => {
          const date = ['周']
          const value0 = ['未故障']
          const value1 = ['故障']
          for (const i of body) {
            date.push(i.cname)
            value0.push(i.value0)
            value1.push(i.value1)
          }
          const source = []
          source.push(date)
          source.push(value0)
          source.push(value1)
          this.initChart(source, date[date.length - 1])
        })
    }
  }
}
</script>

<style scoped>

</style>
