<!--suppress HtmlUnknownTag -->
<template>
  <div class="podClass">
    <el-card shadow="hover" :class="pod.restartCount | toPodClass">
      <div slot="header">
        <div>{{ pod.name }}</div>
        <el-popover placement="right" trigger="hover">
          <i class="fas fa-globe"/>
          <span style="margin-left: 5px">HostIP {{ pod.hostIP }}</span>
        </el-popover>
      </div>
      <leo-label :name="$t('leo.pod.podIp')" :value="pod.podIP"/>
      <leo-label :name="$t('leo.pod.startTime')">
        {{ pod.startTime }}<span style="color: #00a2d4"> [{{ i18nAgo(pod.ago) }}]</span>
      </leo-label>
      <leo-label :name="$t('leo.pod.restart')">
        <span :style="pod.restartCount === 0 ?  'color: #67C23A' : 'color: #F56C6C'">{{ pod.restartCount }}</span>
      </leo-label>
      <pod-conditions :pod="pod"/>
    </el-card>
  </div>
</template>

<script>
import PodConditions from '@/components/opscloud/leo/child/PodConditions.vue'
import { toPodClass } from '@/filters/kubernetes.pod'
import LeoLabel from '@/components/opscloud/leo/child/LeoLabel.vue'
import tools from '@/libs/tools'

export default {
  name: 'PodVersion',
  props: ['pod'],
  filters: {
    toPodClass
  },
  components: {
    LeoLabel,
    PodConditions
  },
  methods: {
    i18nAgo (ago) {
      return this.$i18n.locale === 'zh-chs' ? ago : tools.i18nAgo(ago)
    }
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
