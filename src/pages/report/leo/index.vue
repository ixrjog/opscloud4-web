<template>
  <d2-container>
    <h1 v-if="false">{{ title }}</h1>
    <el-row :gutter="24" v-if="JSON.stringify(report) !== '{}'">
      <el-col :span="8">
        <el-card shadow="hover">
          <div>
            <b style="color: #9d9fa3">用户统计</b>
          </div>
          <span style="font-size: 10px; color: #B7B6B6">活跃用户</span>
          <span style="font-size: 45px;color:#20A9D9 ;font-weight: 300">{{report.dashboard.userTotal}}</span>
          <span style="margin-right: 40px"></span>
          <span style="font-size: 10px; color: #B7B6B6">授权用户</span>
          <span style="font-size: 45px;color:#20A9D9 ;font-weight: 300">{{ report.dashboard.authorizedUserTotal }}</span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div>
            <b style="color: #9d9fa3">应用和任务统计</b>
          </div>
          <span style="font-size: 10px; color: #B7B6B6">应用总数</span>
          <span style="font-size: 45px;color:#20A9D9 ;font-weight: 300">{{ report.dashboard.applicationTotal }}</span>
          <span style="margin-right: 40px"></span>
          <span style="font-size: 10px; color: #B7B6B6">任务总数</span>
          <span style="font-size: 45px;color:#20A9D9 ;font-weight: 300">{{ report.dashboard.jobTotal }}</span>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div>
            <b style="color: #9d9fa3">持续交付作业统计</b>
          </div>
          <span style="font-size: 10px; color: #B7B6B6">总构建次数</span>
          <span style="font-size: 45px;color:#20A9D9 ;font-weight: 300">{{ report.dashboard.buildTotal }}</span>
          <span style="margin-right: 40px"></span>
          <span style="font-size: 10px; color: #B7B6B6">总部署次数</span>
          <span style="font-size: 45px;color:#20A9D9 ;font-weight: 300">{{ report.dashboard.deployTotal }}</span>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
      <el-row :gutter="20">
        <el-col :span="12">
          <div id="buildChart" style="height:280px; width: 100%"></div>
        </el-col>
        <el-col :span="12">
          <div id="deployChart" style="height:280px; width: 100%"></div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px"
                     @click="fetchData" size="mini" plain></el-button>
        </span>
      </el-row>
      <el-row>
        <div id="cDChart" style="height:250px; width: 100%"></div>
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
      title: '持续交付2.0-报表',
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
    initCDChart (continuousDeliveryReport) {
      const myChart = echarts.init(document.getElementById('cDChart'))
      const option = {
        color: ['#36c6ae', '#82daa9'],
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
            stack: 'build',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            },
            emphasis: {
              focus: 'series'
            },
            data: continuousDeliveryReport.valueMap.BUILD
          },
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
    initBuildChart (data, color) {
      const myChart = echarts.init(document.getElementById('buildChart'))
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
      myChart.setOption(option, true)
    },
    initDeployChart (data, color) {
      const myChart = echarts.init(document.getElementById('deployChart'))
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
                  fontSize: 12,
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
      myChart.setOption(option, true)
    },
    initData () {
      this.initCDChart(this.report.continuousDeliveryReport)
      this.initBuildChart(this.report.buildWithEnvReport.map(e => ({ name: e.cname, value: e.value })),
        this.report.buildWithEnvReport.map(e => (e.color)))
      this.initDeployChart(this.report.deployWithEnvReport.map(e => ({ name: e.cname, value: e.value })),
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

.chart {
  height: 100vh;
}

</style>
