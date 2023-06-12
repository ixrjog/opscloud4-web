<!--suppress HtmlUnknownTag -->
<template>
  <el-tag size="mini" style="float: right;margin-right: 5px" class="position" :type="pod | toPodPhaseType">
    <i class="el-icon-loading" v-show="!pod.isComplete"></i>
    <span v-show="pod.terminating">Terminating</span>
    <span v-show="!pod.terminating">{{pod.reason === null || pod.reason === undefined ? pod.phase : pod.reason}}</span>
    <el-popover placement="right" trigger="hover">
      <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"/>
      <entry-detail name="Initialized" :value="pod.conditions.Initialized"/>
      <br/>
      <entry-detail name="Ready" :value="pod.conditions.Ready"/>
      <br/>
      <entry-detail name="ContainersReady" :value="pod.conditions.ContainersReady"/>
      <br/>
      <entry-detail name="PodScheduled" :value="pod.conditions.PodScheduled"/>
    </el-popover>
  </el-tag>
</template>

<script>
import EntryDetail from '@/components/opscloud/common/EntryDetail'
import { toPodPhaseType } from '@/filters/kubernetes.pod'

export default {
  name: 'PodConditions',
  props: ['pod'],
  components: {
    EntryDetail
  },
  filters: {
    toPodPhaseType
  }
}
</script>

<style scoped>

</style>
