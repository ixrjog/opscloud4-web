<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-select v-model="queryParam.applicationName" filterable clearable size="mini"
                 remote reserve-keyword placeholder="搜索并选择应用" :remote-method="getApplication"
                 @change="fetchData">
        <el-option v-for="item in applicationOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.name">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
    </el-row>
    <div style="height: 5px"/>
    <el-card class="box-card" shadow="hover">
      <el-row>
        <span style="float: right">
          <el-button type="text" icon="el-icon-refresh" style="margin-left: 5px" @click="fetchData" size="mini" plain/>
        </span>
      </el-row>
      <el-row>
        <div id="releaseChart" style="height:250px; width: 100%"/>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import * as echarts from 'echarts'

import { QUERY_APPLICATION_PAGE } from '@/api/modules/application/application.api'
import { GET_APOLLO_RELEASE_REPORT } from '@/api/modules/report/report.api'

import SelectItem from '@/components/opscloud/common/SelectItem.vue'

export default {
  name: 'apollo-report',
  props: ['instanceId'],
  data () {
    return {
      title: '生产环境配置发布报表',
      queryParam: { applicationName: '' },
      applicationOptions: [],
      report: {}
    }
  },
  components: { SelectItem },
  computed: {},
  mounted () {
  },
  methods: {
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 10
      }
      QUERY_APPLICATION_PAGE(requestBody)
        .then(({ body }) => {
          this.applicationOptions = body.data
        })
    },
    initReleaseChart (releaseReport) {
      const myChart = echarts.init(document.getElementById('releaseChart'))
      const option = {
        color: ['#36c6ae'],
        title: {
          text: '最近30天生产环境配置发布报表'
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
          data: releaseReport.dateCat
        },
        series: [
          {
            name: '生产',
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
            data: releaseReport.valueMap.PROD
          }
        ]
      }
      myChart.setOption(option, true)
    },
    initData () {
      this.initReleaseChart(this.report.releaseReport)
    },
    fetchData () {
      const requestBody = {
        ...this.queryParam,
        instanceId: this.instanceId
      }
      GET_APOLLO_RELEASE_REPORT(requestBody)
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
  font-size: 12px;
  color: #B7B6B6;
}

.value {
  font-size: 45px;
  color: #20A9D9;
  font-weight: 300;
  margin-left: 2px;
}

</style>
