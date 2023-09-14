<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <el-row>
      <el-select v-model="username" size="mini" filterable remote reserve-keyword placeholder="搜索用户"
                 :remote-method="getUser" class="select" @change="getUserDetail">
        <el-option v-for="user in userOptions"
                   :key="user.username"
                   :label="user.displayName"
                   :value="user.username">
          <select-item :name="user.username" :comment="user.displayName"/>
        </el-option>
      </el-select>
    </el-row>
    <el-row :gutter="24" style="margin-top: 10px" v-if="user !== null">
      <el-col style="width: 400px">
        <user-info :user="user" @fetchData="fetchData"/>
      </el-col>
      <span style="display: flex; flex-flow: row wrap; flex-direction: column; margin-left: 20px">
        <pubkey-info :user="user"/>
        <roles-info :roles="user.roles"/>
        <application-info :userId="user.id"/>
        <user-group-info :userId="user.id"/>
        <server-group-info :userId="user.id"/>
        <user-ram-user-info-card :user="user"/>
        <user-am-info-card :user="user"/>
        <access-token-info :user="user" @fetchData="fetchData"/>
      </span>
    </el-row>
  </d2-container>
</template>

<script>

import UserInfo from '../../../components/opscloud/user/UserInfoCard'
import { GET_USER_DETAILS, GET_USER_DETAILS_BY_USERNAME } from '@/api/modules/user/user.details.api.js'
import PubkeyInfo from '../../../components/opscloud/user/details/UserCredentialPubKeyInfoCard'
import RolesInfo from '../../../components/opscloud/user/details/UserRBACRolesInfoCard'
import ServerGroupInfo from '../../../components/opscloud/user/details/UserPermissionServerGroupInfoCard'
import ApplicationInfo from '../../../components/opscloud/user/details/UserPermissionApplicationInfoCard'
import UserGroupInfo from '../../../components/opscloud/user/details/UserPermissionGroupInfoCard'
import AccessTokenInfo from '../../../components/opscloud/user/details/UserAccessTokenCard'
import UserRamUserInfoCard from '../../../components/opscloud/user/details/UserRamUserInfoCard'
import { QUERY_USER_PAGE } from '@/api/modules/user/user.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import UserAmInfoCard from '@/components/opscloud/user/details/UserAmInfoCard'

export default {
  data () {
    return {
      user: null,
      userOptions: [],
      username: ''
    }
  },
  mounted () {
    this.username = this.$route.query.username
    this.fetchData()
  },
  components: {
    SelectItem,
    UserInfo,
    PubkeyInfo, // Ssh公钥
    RolesInfo,
    ServerGroupInfo,
    ApplicationInfo,
    UserGroupInfo,
    AccessTokenInfo,
    UserAmInfoCard,
    UserRamUserInfoCard
  },
  methods: {
    fetchData () {
      if (this.username === '' || this.username === undefined) {
        GET_USER_DETAILS()
          .then(res => {
            this.user = res.body
          })
      } else {
        this.getUser(this.username)
        this.getUserDetail()
      }
    },
    getUser (queryName) {
      const requestBody = {
        queryName: queryName,
        extend: false,
        page: 1,
        length: 20
      }
      QUERY_USER_PAGE(requestBody)
        .then(res => {
          this.userOptions = res.body.data
        })
    },
    getUserDetail () {
      this.user = null
      GET_USER_DETAILS_BY_USERNAME({ username: this.username })
        .then(res => {
          this.user = res.body
        })
    }
  }
}
</script>

<style scoped>

</style>
