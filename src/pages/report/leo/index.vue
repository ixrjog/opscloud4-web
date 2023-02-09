<template>
  <d2-container>
    <h1>{{ title }}</h1>
    <el-row :gutter="24" v-if="JSON.stringify(report) !== '{}'">
      <el-col :span="4">
        <dashboard-card :title="'授权用户总数'" :tag="'Authorized Users'" :value="report.dashboard.authorizedUserTotal"
                        :value-desc="'All authorized users'"></dashboard-card>
      </el-col>
      <el-col :span="4">
        <dashboard-card :title="'活跃用户总数'" :tag="'Users'" :value="report.dashboard.userTotal"
                        :value-desc="'All users'"></dashboard-card>
      </el-col>
      <el-col :span="4">
        <dashboard-card :title="'应用总数'" :tag="'Applications'" :value="report.dashboard.applicationTotal"
                        :value-desc="'All applications'"></dashboard-card>
      </el-col>
      <el-col :span="4">
        <dashboard-card :title="'任务总数'" :tag="'Jobs'" :value="report.dashboard.jobTotal"
                        :value-desc="'All jobs'"></dashboard-card>
      </el-col>
      <el-col :span="4">
        <dashboard-card :title="'构建总次数'" :tag="'Builds'" :value="report.dashboard.buildTotal"
                        :value-desc="'All builds'"></dashboard-card>
      </el-col>
      <el-col :span="4">
        <dashboard-card :title="'部署总次数'" :tag="'Deploys'" :value="report.dashboard.deployTotal"
                        :value-desc="'All deploys'"></dashboard-card>
      </el-col>
    </el-row>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px"
                     @click="fetchData" size="mini" plain></el-button>
        </span>
      </el-row>
      <el-row>
        <div id="continuousDeliveryReportChart" style="height:350px; width: 100%"></div>
      </el-row>
      <el-row v-if="false">
        <div id="buildReportChart" style="height:350px; width: 100%"></div>
      </el-row>
      <el-row v-if="false">
        <div id="deployReportChart" style="height:350px; width: 100%"></div>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="12">
          <div id="buildWithEnvReportChart" style="height:350px; width: 100%"></div>
        </el-col>
        <el-col :span="12">
          <div id="deployWithEnvReportChart" style="height:350px; width: 100%"></div>
        </el-col>
      </el-row>
    </el-card>
    <!--    <div v-if="false" v-for="instance in report.instances" :key="instance.instanceId" style="margin-bottom: 20px">-->
    <!--      <jenkins-build-executor-status-card-->
    <!--        :instanceId="instance.instanceId"-->
    <!--        :ref="`instance_${instance.instanceId}_buildExecutor`">-->
    <!--      </jenkins-build-executor-status-card>-->
    <!--    </div>-->

  </d2-container>
</template>

<script>

import * as echarts from 'echarts'
// API
import { GET_LEO_REPORT } from '@/api/modules/report/report.api'
import DashboardCard from '@/components/opscloud/report/DashboardCard.vue'

export default {
  data () {
    return {
      title: '持续交付-报表',
      report: {}
    }
  },
  components: {
    DashboardCard
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  methods: {
    initContinuousDeliveryReportChart (continuousDeliveryReport) {
      const myChart = echarts.init(document.getElementById('continuousDeliveryReportChart'))
      const option = {
        color: ['#179bb9', '#c90a12'],
        title: {
          text: '持续交付(月)报表'
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
            name: '构建次数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: continuousDeliveryReport.valueMap.BUILD
          },
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
            data: continuousDeliveryReport.valueMap.DEPLOY
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initBuildWithEnvChart (data, color) {
      const myChart = echarts.init(document.getElementById('buildWithEnvReportChart'))
      const option = {
        title: {
          text: '构建按环境占比'
        },
        color: color,
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left'
        // },
        series: [
          {
            name: '环境',
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
                  lineHeight: 22,
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
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
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
      myChart.setOption(option, true)
    },
    initDeployWithEnvChart (data, color) {
      const myChart = echarts.init(document.getElementById('deployWithEnvReportChart'))
      const option = {
        title: {
          text: '部署按环境占比'
        },
        color: color,
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left'
        // },
        series: [
          {
            name: '环境',
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
                  lineHeight: 22,
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
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
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
      myChart.setOption(option, true)
    },
    initData () {
      this.initContinuousDeliveryReportChart(this.report.continuousDeliveryReport)
      this.initBuildWithEnvChart(this.report.buildWithEnvReport.map(e => ({ name: e.cname, value: e.value })),
        this.report.buildWithEnvReport.map(e => (e.color)))
      this.initDeployWithEnvChart(this.report.deployWithEnvReport.map(e => ({ name: e.cname, value: e.value })),
        this.report.deployWithEnvReport.map(e => (e.color)))

      // this.$nextTick(() => {
      //   for (let instance of this.report.instances) {
      //     this.$refs[`instance_${instance.instanceId}_buildExecutor`][0].start()
      //   }
      // }, 5000)
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

</style>
