<template>
  <div>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>SSH密钥<i class="header-icon el-icon-info"></i>(SSH-Server专用)</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handlerEdit">编辑</el-button>
      </div>
      <div>
        <!-- local sshPubKey-->
        <span
          v-if="JSON.stringify(user.credentialDetails.credentialMap) !== '{}' && user.credentialDetails.credentialMap.PUB_KEY !== null">
             <el-card shadow="hover" style="margin-right: 10px;margin-bottom: 10px;float: left;width: 305px">
               <el-tag size="mini" style="margin-bottom: 5px">{{ user.credentialDetails.credentialMap.PUB_KEY[0].title }}</el-tag>
               <div style="font-size: 12px"><i class="fas fa-fingerprint"></i>
                 <span style="color: #B7B6B6">
                   {{ user.credentialDetails.credentialMap.PUB_KEY[0].fingerprint }}
                 </span>
               </div>
             </el-card>
           </span>
        <!--  gitlab sshPubKey-->
        <span
          v-if="JSON.stringify(user.credentialDetails.assetCredentialMap) !== '{}' && user.credentialDetails.assetCredentialMap.GITLAB_SSHKEY !== null">
             <span v-for="asset in user.credentialDetails.assetCredentialMap.GITLAB_SSHKEY" :key="asset.id">
               <el-card shadow="hover" style="margin-right: 10px;margin-bottom: 10px;float: left;width: 305px">
                 <el-tag size="mini" style="margin-bottom: 5px" type="success">{{ asset.description }}</el-tag>
                 <i class="fab fa-gitlab" style="float: right"></i>
                 <div style="font-size: 12px"><i class="fas fa-fingerprint"></i>
                   <span style="color: #B7B6B6">
                     {{ asset.assetKey }}
                   </span>
                 </div>
               </el-card>
             </span>
           </span>
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
>>> .el-card__body {
  padding: 10px 10px;
}

>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

/*.el-card {*/
/*  display: flex;*/
/*  flex-wrap: wrap;*/

/*  .terminal-session-instance-info {*/
/*    margin-bottom: 4px;*/
/*    flex-grow: 1;*/
/*    flex-basis: 50%;*/
/*  }*/
/*}*/
</style>
