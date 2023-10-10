<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-form :model="transferUserData" label-width="120px">
      <el-form-item label="SFTP UserName" required :label-width="labelWidth">
        <el-input v-model="transferUserData.userName" size="mini"/>
        <div style="margin-top: 5px">
          <my-highlight code="Regex: ^\w[\w@.-]{2,99}$" lang="json"/>
        </div>
      </el-form-item>
      <el-form-item label="SFTP SshPublicKey" required :label-width="labelWidth">
        <el-input v-model="transferUserData.sshPublicKey" size="mini" type="textarea"/>
        <div style="margin-top: 5px">
          <my-highlight :code="sshKeyDesc" lang="json"/>
        </div>
      </el-form-item>
      <el-form-item label="Desc" required :label-width="labelWidth">
        <el-input v-model="transferUserData.comment" size="mini" placeholder="Please enter an transfer description"/>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button plain type="primary" @click="addTicketEntry" :loading="buttonAdding" size="mini">
          Save
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {
  QUERY_WORK_ORDER_TICKET_ENTRY,
  ADD_WORK_ORDER_TICKET_ENTRY
} from '@/api/modules/workorder/workorder.ticket.api'
import MyHighlight from '@/components/opscloud/common/MyHighlight.vue'

const sshKeyDesc =
  'AWS Transfer Family accepts RSA, ECDSA, and ED25519 keys.\n' +
  'For RSA keys, the key type is ssh-rsa.\n' +
  'For ED25519 keys, the key type is ssh-ed25519.\n' +
  'For ECDSA keys, the key type is either ecdsa-sha2-nistp256, ecdsa-sha2-nistp384, or ecdsa-sha2-nistp521, \n' +
  '    depending on the size of the key you generated.\n' +
  'Length Constraints: Maximum length of 2048.'

const transferUserData = {
  userName: '',
  sshPublicKey: '',
  comment: ''
}

export default {
  name: 'TicketAwsTransferCreateUserForm',
  props: {
    workOrderTicketId: {
      type: Number,
      required: true
    }
  },
  components: {
    MyHighlight
  },
  data () {
    return {
      sshKeyDesc: sshKeyDesc,
      labelWidth: '200px',
      instanceUuid: '',
      transferUserData: transferUserData,
      searchLoading: false,
      buttonAdding: false,
      ticketEntry: {}
    }
  },
  mounted () {
  },
  methods: {
    initDate () {
      this.fetchData()
    },
    addTicketEntry () {
      if (this.transferUserData.userName === '') {
        this.$message.warning('Please enter an transfer userName')
        return
      }
      if (this.transferUserData.sshPublicKey === '') {
        this.$message.warning('Please select an transfer sshPublicKey')
        return
      }
      if (this.transferUserData.comment === '') {
        this.$message.warning('Please enter an transfer description')
        return
      }
      this.buttonAdding = true
      const requestBody = {
        ...this.ticketEntry,
      }
      requestBody.name = this.transferUserData.userName
      requestBody.comment = this.transferUserData.comment
      requestBody.entry = this.transferUserData
      requestBody.content = JSON.stringify(this.transferUserData)
      requestBody.entryKey = this.transferUserData.userName
      ADD_WORK_ORDER_TICKET_ENTRY(requestBody).then(() => {
        this.buttonAdding = false
        this.ticketEntry = ''
        this.handleNotify()
      }).catch(() => {
        this.buttonAdding = false
      })
    },
    fetchData () {
      this.searchLoading = true
      const requestBody = {
        queryName: '',
        instanceUuid: this.instanceUuid,
        workOrderTicketId: this.workOrderTicketId,
        length: 20
      }
      QUERY_WORK_ORDER_TICKET_ENTRY(requestBody)
        .then(res => {
          if (res.body.length === 1) {
            this.ticketEntry = res.body[0]
          }
          this.searchLoading = false
        })
    },
    handleNotify () {
      this.$emit('handleNotify')
    }
  }
}
</script>

<style scoped>

</style>
