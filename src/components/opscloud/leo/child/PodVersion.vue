<!--suppress HtmlUnknownTag -->
<template>
  <div class="podClass">
    <el-card shadow="hover" :class="pod.restartCount | toPodClass">
      <div>{{ pod.name }}</div>
      <el-popover placement="right" trigger="hover"><i class="fas fa-globe"></i><span style="margin-left: 5px">HostIP {{ pod.hostIP }}</span>
      </el-popover>
      <div><span class="label">容器组IP</span>{{ pod.podIP }}</div>
      <div><span class="label">启动时间</span>{{ pod.startTime }}<span style="color: #00a2d4"> [{{ pod.ago }}]</span> 重启次数:
        <span :style="pod.restartCount === 0 ?  'color: #67C23A' : 'color: #F56C6C'">{{ pod.restartCount }}</span>
      </div>
      <pod-conditions :pod="pod"/>
    </el-card>
  </div>
</template>

<script>
import PodConditions from '@/components/opscloud/leo/child/PodConditions.vue'
import { toPodClass } from '@/filters/kubernetes.pod'

export default {
  name: 'PodVersion',
  props: ['pod'],
  filters: {
    toPodClass
  },
  components: {
    PodConditions
  }
}
</script>

<style lang="less" scoped>

.podClass {
  .el- {
    &card {
      margin-bottom: 5px;
      margin-right: 5px;
      position: relative;
      width: 350px;
      display: inline-block;

      /deep/ .el-card__body {
        padding: 10px;
      }

      .position {
        position: absolute;
        right: 5px;
        top: 10px;
        font-size: 12px;
      }
    }
  }
}

.label {
  color: #99a9bf;
  margin-right: 5px;
}

.podFault {
  border: 2px solid #e56c0d;
}

.podNormal {
}

</style>
