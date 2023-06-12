<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>SSH密钥<i class="header-icon el-icon-info"></i>(SSH-Server专用)</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleEdit">编辑</el-button>
      </div>
      <div>
        <span v-if="user.credentialDetails.credentialMap && user.credentialDetails.credentialMap.PUB_KEY">
          <el-card shadow="hover" style="margin-right: 10px;margin-bottom: 10px;float: left;width: 305px">
            <el-tag size="mini" style="margin-bottom: 5px">
              {{ user.credentialDetails.credentialMap.PUB_KEY[0].title }}
            </el-tag>
            <div style="font-size: 12px">
              <i class="fas fa-fingerprint" style="color: #9d9fa3"><span
                style="margin-left: 1px">{{ user.credentialDetails.credentialMap.PUB_KEY[0].fingerprint }}</span></i>
            </div>
          </el-card>
        </span>
        <!--  gitLab sshPubKey-->
        <span v-if="user.credentialDetails.credentialMap && user.credentialDetails.credentialMap.PUB_KEY">
          <span v-for="asset in user.credentialDetails.assetCredentialMap.GITLAB_SSHKEY" :key="asset.id">
            <el-card shadow="hover" style="margin-right: 10px;margin-bottom: 10px;float: left;width: 305px">
              <el-tag size="mini" style="margin-bottom: 5px" type="success">{{ asset.description }}</el-tag>
              <i class="fab fa-gitlab" style="float: right"/>
              <div style="font-size: 12px">
                <i class="fas fa-fingerprint" style="color: #9d9fa3"><span style="margin-left: 1px">{{
                    asset.assetKey
                  }}</span></i>
              </div>
            </el-card>
          </span>
        </span>
      </div>
    </el-card>
    <pubkey-editor :form-status="formStatus.pubKey" ref="pubkeyEditor" @fetchData="fetchData"/>
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
    handleEdit () {
      const credentialMap = this.user.credentialDetails.credentialMap
      let pubKey = {}
      if (credentialMap?.PUB_KEY) {
        pubKey = Object.assign({}, credentialMap.PUB_KEY[0])
      } else {
        pubKey = {
          id: '',
          userId: '',
          valid: true,
          title: '',
          credential: '',
          credentialType: 0
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
>>> .el-card__body {
  padding: 10px 10px;
}

>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
