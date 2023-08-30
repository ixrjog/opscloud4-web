<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-button @click="fetchData" size="mini"><i class="fas fa-circle-notch"/></el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <div id="finOpsChart" style="height:500px; width: 100%"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
          <el-table-column prop="tag" label="FinOps Tag"/>
          <el-table-column prop="desc" label="FinOps Desc"/>
          <el-table-column prop="replicaTotal" label="Replica Total"/>
          <el-table-column prop="displayRate" label="Rate"/>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { GET_KUBERNETES_FINOPS_REPORT } from '@/api/modules/report/report.api'
import * as echarts from 'echarts'

export default {
  name: 'KubernetesFinOpsTable',
  props: {
    instanceId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      table: {
        data: [],
        loading: false
      }
    }
  },
  computed: {},
  mounted () {
  },
  components: {},
  methods: {
    initChart (finOpsData) {
      const myChart = echarts.init(document.getElementById('finOpsChart'))
      const data = finOpsData.map(e => ({ name: e.tag, value: e.replicaTotal }))

      const option = {
        title: {
          text: 'FinOps'
        },
        //color: color,
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'FinOps',
            type: 'pie',
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            label: {
              formatter: ' {b|{b}：}{c}  {per|{d}%} ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 20,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 10,
                  fontWeight: 'bold',
                  lineHeight: 22
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
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

      const optionX = {
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 250],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: data
          }
        ]
      }
      myChart.setOption(option, true)
    },
    fetchData () {
      this.table.loading = true
      GET_KUBERNETES_FINOPS_REPORT({ instanceId: this.instanceId })
        .then(res => {
          this.table.data = res.body.data
          this.table.loading = false
          this.initChart(res.body.data)
        })
    }
  }
}
</script>

<style scoped>
</style>
