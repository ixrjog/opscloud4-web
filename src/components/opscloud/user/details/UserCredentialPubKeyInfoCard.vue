<template>
  <div>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>SSH密钥<i class="header-icon el-icon-info"></i>(SSH-Server专用)</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handlerEdit">编辑</el-button>
      </div>
      <!--       local sshPubKey-->
      <div v-if="JSON.stringify(user.credentialDetails.credentialMap) !== '{}' && user.credentialDetails.credentialMap.PUB_KEY !== null">
        <el-tag
          style="margin-left: 5px;margin-bottom: 2px">
          {{ user.credentialDetails.credentialMap.PUB_KEY[0].title }}<{{ user.credentialDetails.credentialMap.PUB_KEY[0].fingerprint }}>
        </el-tag>
      </div>
      <!--      gitlab sshPubKey-->
      <div  v-if="JSON.stringify(user.credentialDetails.assetCredentialMap) !== '{}' && user.credentialDetails.assetCredentialMap.GITLAB_SSHKEY !== null">
        <div v-for="item in user.credentialDetails.assetCredentialMap.GITLAB_SSHKEY" :key="item.id">
          <el-tooltip class="item" effect="light" :content="'Gitlab公钥配置'" placement="top-start">
            <el-tag type="success" style="margin-left: 5px;margin-bottom: 2px"><i class="fab fa-gitlab"></i> {{ item.description }}<{{ item.assetKey }}></el-tag>
         </el-tooltip>
        </div>
      </div>
    </el-card>
    <pubkey-editor :form-status="formStatus.pubKey" ref="pubkeyEditor" @fetchData="fetchData"></pubkey-editor>
  </div>
</template>

<script>
import PubkeyEditor from './UserCredentialPubKeyEditor'

export default {
  name: 'UserCredentialPubKeyInfoCard',
  props: ['user'],
  data () {
    return {
      formStatus: {
        pubKey: {
          visible: false,
          labelWidth: '100px',
          title: '编辑SSH公钥'
        }
      }
    }
  },
  components: {
    PubkeyEditor
  },
  methods: {
    handlerEdit () {
      const credentialMap = this.user.credentialDetails.credentialMap
      let pubKey = {}
      if (JSON.stringify(credentialMap) !== '{}' && credentialMap.PUB_KEY !== null) {
        pubKey = Object.assign({}, credentialMap.PUB_KEY[0])
      } else {
        pubKey = {
          id: '',
          userId: '',
          valid: true,
          title: '',
          credential: '',
          credentialType: 0 // PUB_KEY
        }
      }
      this.$refs.pubkeyEditor.initData(pubKey)
      this.formStatus.pubKey.visible = true
    },
    fetchData () {
      this.$emit('fetchData')
    }
  }
}
</script>

<style scoped>
  >>> .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
