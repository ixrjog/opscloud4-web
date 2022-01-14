<template>
  <div>
    <span v-for="node in workflowView.nodes" :key="node.name">
      <!--节点标题-->
      <el-divider><b style="font-size: 10px;color: #909399">{{ node.comment }}</b></el-divider>
      <span v-if="node.type === 0">
         <el-select v-model="node.auditUser" filterable placeholder="选择审批人" value-key="id"
                    style="display: inline-block; width: 250px; margin-right: 10px">
                <el-option
                  v-for="auditUser in node.auditUsers"
                  :key="auditUser.id"
                  :label="auditUser.displayName"
                  :value="auditUser">
                  <select-item :name="auditUser.username" :comment="auditUser.displayName"></select-item>
                </el-option>
         </el-select>
         <span v-if="node.auditUser !== null" style="display: inline-block">
           <el-avatar
             v-if="node.auditUser !== null && node.auditUser.avatar !== null && node.auditUser.avatar !== undefined"
             :src="node.auditUser.avatar" :size="20"></el-avatar>
             <user-tag :user="node.auditUser"></user-tag>
         </span>
      </span>
      <span v-if="node.type === 1">
             <span v-for="auditUser in node.auditUsers" :key="auditUser.id"
                   style="margin-right: 5px;display: inline-block">
               <el-avatar v-if="auditUser !== null && auditUser.avatar !== null && auditUser.avatar !== undefined"
                          :src="auditUser.avatar" :size="20"></el-avatar>
               <user-tag :user="auditUser"></user-tag>
             </span>
      </span>
    </span>
  </div>
</template>

<script>
import UserTag from '@/components/opscloud/common/tag/UserTag'
import SelectItem from '@/components/opscloud/common/SelectItem'

export default {
  name: 'WorkflowNodes',
  props: ['workflowView'],
  data () {
    return {
      auditUser: ''
    }
  },
  components: {
    UserTag,
    SelectItem
  }
}
</script>

<style scoped>

.el-divider--horizontal {
  margin: 15px 0 10px;
}

</style>
