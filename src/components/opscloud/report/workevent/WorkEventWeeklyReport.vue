<template>
  <div>
    <el-card shadow="hover">
      <div id="workEventReport" style="width: 100%; height: 400px; margin-top: 20px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { GET_WORK_EVENT_WEEKLY_REPORT } from '@/api/modules/report/report.api'

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
  name: 'WorkEventWeeklyReport',
  data () {
    return {
      weeklyReport: {},
      legendData: [],
      xData: [],
      yData: [],
      color: [],
      detail: false
    }
  },
  mounted () {
  },
  methods: {
    initChart () {
      const myChart = echarts.init(document.getElementById('workEventReport'))
      const option = {
        title:{
          text:'工作事件(周)报表'
        },
        color: this.color,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: this.legendDate
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
            data: this.xData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.yData
      }
      myChart.setOption(option, true)
    },
    fetchData (workRoleId) {
      if (workRoleId !== '') {
        GET_WORK_EVENT_WEEKLY_REPORT({ workRoleId: workRoleId })
          .then(({ body }) => {
            this.weeklyReport = body
            this.initData()
            this.initChart()
          })
      }
    },
    initData () {
      this.color = []
      this.xData = []
      this.yData = []
      this.legendData = []
      this.xData = this.weeklyReport.weeks
      const typeMap = this.objToMap(this.weeklyReport.valueMap)
      typeMap.forEach((value, key) => {
        this.legendData.push(key)
        const item = Object.assign({}, data)
        item.name = key
        item.stack = 'type'
        item.data = value.values
        this.color.push(value.color)
        this.yData.push(item)
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
