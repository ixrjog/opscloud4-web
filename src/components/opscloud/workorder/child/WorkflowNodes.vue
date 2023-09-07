<!--suppress HtmlUnknownTag -->
<template>
  <div v-if="workflowView.nodes.length !== 0">
    <el-card shadow="hover">
      <el-form ref="form" label-width="80px">
        <span v-for="node in workflowView.nodes" :key="node.name">
          <!--节点标题-->
          <el-divider>
            <b style="font-size: 10px;color: #909399">{{ node.name }}</b>
          </el-divider>
          <span v-if="node.type === 0">
            <el-form-item :label="$t('workOrder.approvedBy')" :required="true" :label-width="labelWidth">
              <div style="display: flex">
                <el-select v-if="ticketPhase !== null && ticketPhase === 'NEW'" size="mini"
                           v-model="node.auditUser" filterable :placeholder="$t('workOrder.selectApprover')" value-key="id"
                           style="width: 250px; margin-right: 10px">
                  <el-option v-for="auditUser in node.auditUsers"
                             :key="auditUser.id"
                             :label="auditUser.displayName"
                             :value="auditUser">
                    <select-item :name="auditUser.username" :comment="auditUser.displayName"/>
                  </el-option>
                </el-select>
                <span style="display: inline-block">
                  <user-avatar :user="node.auditUser" :size="avatar.size"/>
                </span>
              </div>
            </el-form-item>
          </span>
          <span v-if="node.type === 1">
            <el-form-item :label="$t('workOrder.automaticAssign')" :label-width="labelWidth">
              <span v-for="auditUser in node.auditUsers" :key="auditUser.id"
                    style="margin-right: 5px;display: inline-block">
                <user-avatar :user="auditUser" :size="avatar.size"/>
               </span>
            </el-form-item>
          </span>
        </span>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import SelectItem from '@/components/opscloud/common/SelectItem'
import UserAvatar from '@/components/opscloud/workorder/child/UserAvatar'

export default {
  name: 'WorkflowNodes',
  props: {
    workflowView: {
      type: Object,
      required: false,
      default: function () {
        return { nodes: [] }
      }
    },
    ticketPhase: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      labelWidth: '150px',
      avatar: {
        size: 24
      },
      auditUser: ''
    }
  },
  components: {
    UserAvatar,
    SelectItem
  }
}
</script>

<style scoped>

.el-divider--horizontal {
  margin: 15px 0 10px;
}

.el-form-item--mini.el-form-item {
  margin: 0;
}

</style>
