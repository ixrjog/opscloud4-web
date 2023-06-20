<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>
      <el-avatar v-if="user !== null && user.avatar !== null && user.avatar !== undefined" :src="user.avatar"
                 :size="50"/>
    </h1>
    <el-row :gutter="24" style="margin-bottom: 5px" v-if="user !== null">
      <el-col :span="7">
        <user-info :user="user" @fetchData="fetchData"/>
      </el-col>
      <el-col :span="17">
        <pubkey-info :user="user"/>
        <roles-info :roles="user.roles"/>
        <application-info :userId="user.id"/>
        <user-group-info :userId="user.id"/>
        <server-group-info :userId="user.id"/>
        <user-ram-user-info-card :user="user"/>
        <user-am-info-card :user="user"/>
        <access-token-info :user="user" @fetchData="fetchData"/>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

import UserInfo from '../../../components/opscloud/user/UserInfoCard'
import { GET_USER_DETAILS } from '@/api/modules/user/user.details.api.js'
import PubkeyInfo from '../../../components/opscloud/user/details/UserCredentialPubKeyInfoCard'
import RolesInfo from '../../../components/opscloud/user/details/UserRBACRolesInfoCard'
import ServerGroupInfo from '../../../components/opscloud/user/details/UserPermissionServerGroupInfoCard'
import ApplicationInfo from '../../../components/opscloud/user/details/UserPermissionApplicationInfoCard'
import UserGroupInfo from '../../../components/opscloud/user/details/UserPermissionGroupInfoCard'
import AccessTokenInfo from '../../../components/opscloud/user/details/UserAccessTokenCard'
import UserRamUserInfoCard from '../../../components/opscloud/user/details/UserRamUserInfoCard'
import UserAmInfoCard from '@/components/opscloud/user/details/UserAmInfoCard'

export default {
  data () {
    return {
      user: null
    }
  },
  mounted () {
    this.fetchData()
  },
  components: {
    UserInfo,
    PubkeyInfo, // Ssh公钥
    RolesInfo,
    ApplicationInfo,
    ServerGroupInfo,
    UserGroupInfo,
    AccessTokenInfo,
    UserAmInfoCard,
    UserRamUserInfoCard
  },
  methods: {
    fetchData () {
      GET_USER_DETAILS()
        .then(res => {
          this.user = res.body
        })
    }
  }
}
</script>

<style scoped>

</style>
