<!--suppress HtmlUnknownTag -->
<template>
  <div v-if="steps !== null && steps.length !== 0">
    <el-divider/>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <b style="color: #5b5d66; margin-left: 10px;">Steps Log</b>
        <el-tooltip class="item" effect="light" content="关闭步骤详情" placement="top-start">
          <el-button class="stepsButton" type="text" @click="closeSteps">
            <i class="far fa-times-circle"/>
          </el-button>
        </el-tooltip>
      </div>
      <div v-for="(step,i) in steps" :key="step.id" style="font-size: 12px; margin-bottom: 15px">
        <div class="displayName" :style="{height: '20px'}">
          <el-tag :type="step.result | getBuildResultType">{{ step.result }}</el-tag>
          {{ step.displayName }}
          <!--        <el-tag effect="dark" style="margin-left: 5px" :type="step.result|  getStepResultType">Step {{i +1}}-->
          <!--        </el-tag>-->
        </div>
        <terminal-with-log :ref="`terminal-log${i}`" :step="step"/>
      </div>
    </el-card>
  </div>
</template>

<script>

import util from '@/libs/util'
import { getBuildResultType } from '@/filters/leo.build.result.js'
import TerminalWithLog from '@/components/opscloud/leo/child/TerminalWithLog'

export default {
  name: 'PipelineStep',
  props: [],
  components: {
    TerminalWithLog
  },
  filters: {
    getBuildResultType
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      item: {
        name: util.uuid()
      },
      steps: []
    }
  },
  methods: {
    handleSwitch () {
      for (let i = 0; i < this.steps.length; i++) {
        this.$refs[`terminal-log${i}`][0].init()
      }
    },
    closeSteps () {
      this.steps = []
    },
    init (steps) {
      this.steps = steps
    },
    sendMessage (message) {
    }
  }
}
</script>

<style scoped>

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 5px 0;
}

.stepsTitle {
  color: #c9171f;
  margin-left: 100px;
}

.stepsButton {
  float: right;
  padding: 3px 0;
  margin-right: 10px;
}

.displayName {
  box-shadow: 0 0px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

</style>
